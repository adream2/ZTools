<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { RATIOS, applyRatio, clampRect, cropImage, download, toNaturalRect, type Rect } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import Field from '@/components/ui/Field.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import { toastError } from '@/core/toast'

const file = ref<File | null>(null)
const src = ref('')
const imgEl = ref<HTMLImageElement | null>(null)
const rect = ref<Rect | null>(null)
const ratio = ref('0')
const cropping = ref(false)
const output = ref<{ blob: Blob; url: string } | null>(null)
const natural = ref({ w: 0, h: 0 })

const ratioOptions = RATIOS.map((r) => ({ label: r.label, value: String(r.value ?? 0) }))

let start: { x: number; y: number } | null = null

function bounds(): { w: number; h: number } {
  const el = imgEl.value
  return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 0, h: 0 }
}

function pos(e: PointerEvent): { x: number; y: number } {
  const el = imgEl.value
  if (!el) return { x: 0, y: 0 }
  const r = el.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

function onDown(e: PointerEvent): void {
  if (!imgEl.value) return
  const p = pos(e)
  start = p
  rect.value = { x: p.x, y: p.y, w: 0, h: 0 }
  imgEl.value.setPointerCapture(e.pointerId)
}

function onMove(e: PointerEvent): void {
  if (!start || !imgEl.value) return
  const p = pos(e)
  const b = bounds()
  const x = Math.min(start.x, p.x)
  const y = Math.min(start.y, p.y)
  const w = Math.abs(p.x - start.x)
  const h = Math.abs(p.y - start.y)
  const next = clampRect({ x, y, w, h }, b)
  rect.value = applyRatio(next, Number(ratio.value) || null, b)
}

function onUp(): void {
  start = null
  if (rect.value && (rect.value.w < 8 || rect.value.h < 8)) rect.value = null
}

async function onFiles(files: File[]): Promise<void> {
  const f = files[0]
  if (!f) return
  if (src.value) URL.revokeObjectURL(src.value)
  if (output.value) URL.revokeObjectURL(output.value.url)
  file.value = f
  src.value = URL.createObjectURL(f)
  rect.value = null
  output.value = null

  const bitmap = await createImageBitmap(f)
  natural.value = { w: bitmap.width, h: bitmap.height }
  bitmap.close()
}

async function crop(): Promise<void> {
  if (!file.value || !rect.value) return
  cropping.value = true
  try {
    const b = bounds()
    const nr = toNaturalRect(rect.value, b, natural.value)
    if (nr.w < 2 || nr.h < 2) throw new Error('选区太小')
    if (output.value) URL.revokeObjectURL(output.value.url)
    output.value = await cropImage(file.value, nr)
  } catch (e) {
    toastError(e instanceof Error ? e.message : String(e))
  } finally {
    cropping.value = false
  }
}

const selText = computed(() => {
  if (!rect.value) return '在图片上拖拽框选'
  const b = bounds()
  const nr = toNaturalRect(rect.value, b, natural.value)
  return `${nr.w} × ${nr.h} px`
})

function reset(): void {
  if (src.value) URL.revokeObjectURL(src.value)
  if (output.value) URL.revokeObjectURL(output.value.url)
  file.value = null
  src.value = ''
  rect.value = null
  output.value = null
}

onBeforeUnmount(() => {
  if (src.value) URL.revokeObjectURL(src.value)
  if (output.value) URL.revokeObjectURL(output.value.url)
})
</script>

<template>
  <div class="crop">
    <FileDropZone v-if="!file" accept="image/*" hint="选择图片" :max-size="30 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="bar">
        <div class="bar__f">
          <Field label="比例">
            <BaseSelect v-model="ratio" :options="ratioOptions" />
          </Field>
        </div>
        <div class="bar__info u-xs u-dim">
          原图 {{ natural.w }} × {{ natural.h }} · 选区 {{ selText }}
        </div>
        <BaseButton size="sm" variant="ghost" @click="reset">换一张</BaseButton>
      </div>

      <div class="stage">
        <div class="canvas">
          <img ref="imgEl" :src="src" alt="待裁剪图片" draggable="false" @pointerdown.prevent="onDown" @pointermove.prevent="onMove" @pointerup="onUp" />
          <div
            v-if="rect && rect.w > 0"
            class="sel"
            :style="{ left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.w}px`, height: `${rect.h}px` }"
          />
        </div>
      </div>

      <div class="actions">
        <BaseButton variant="primary" :loading="cropping" :disabled="!rect" @click="crop">裁剪</BaseButton>
        <span class="u-xs u-dim">拖拽图片画框，改变比例后再拖一次会自动贴合</span>
      </div>

      <div v-if="output" class="out">
        <div class="out__head">
          <span>裁剪结果</span>
          <BaseButton size="sm" @click="download(output.blob)">下载 PNG</BaseButton>
        </div>
        <img :src="output.url" alt="裁剪结果" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.crop {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.bar__f {
  width: 130px;
}
.bar__info {
  padding-bottom: 8px;
}
.stage {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: repeating-conic-gradient(var(--c-bg-subtle) 0% 25%, var(--c-surface) 0% 50%) 50% / 20px 20px;
  padding: var(--sp-3);
  display: grid;
  place-items: center;
  min-height: 200px;
}
.canvas {
  position: relative;
  display: inline-block;
  max-width: 100%;
  line-height: 0;
  touch-action: none;
}
.canvas img {
  max-width: 100%;
  max-height: 60vh;
  width: auto;
  height: auto;
  user-select: none;
  cursor: crosshair;
}
.sel {
  position: absolute;
  border: 1.5px solid var(--c-accent);
  background: color-mix(in srgb, var(--c-accent) 14%, transparent);
  box-shadow: 0 0 0 9999px rgb(0 0 0 / 28%);
  pointer-events: none;
}
.actions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.out {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.out__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.out img {
  max-width: 100%;
  max-height: 50vh;
  margin: 0 auto;
  display: block;
}
</style>
