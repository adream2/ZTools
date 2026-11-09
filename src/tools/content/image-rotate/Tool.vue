<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { DEFAULT_STATE, download, transformImage, type RotateState } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import { formatBytes } from '@/tools/dev/hash/logic'
import { toastError } from '@/core/toast'

const file = ref<File | null>(null)
const source = ref('')
const state = ref<RotateState>({ ...DEFAULT_STATE })
const format = ref<'image/png' | 'image/jpeg' | 'image/webp'>('image/png')
const result = ref<{ blob: Blob; url: string; width: number; height: number } | null>(null)
const busy = ref(false)
const error = ref('')

const formatOptions = [
  { label: 'PNG（保留透明）', value: 'image/png' },
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'WebP', value: 'image/webp' },
]

async function render(): Promise<void> {
  if (!file.value) return
  busy.value = true
  error.value = ''
  try {
    if (result.value) URL.revokeObjectURL(result.value.url)
    result.value = await transformImage(file.value, state.value, format.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

async function onFiles(files: File[]): Promise<void> {
  const f = files[0]
  if (!f) return
  if (source.value) URL.revokeObjectURL(source.value)
  file.value = f
  source.value = URL.createObjectURL(f)
  state.value = { ...DEFAULT_STATE }
  await render()
}

function rotate(delta: number): void {
  state.value = { ...state.value, angle: (state.value.angle + delta + 360) % 360 }
}

function flip(axis: 'h' | 'v'): void {
  state.value =
    axis === 'h' ? { ...state.value, flipH: !state.value.flipH } : { ...state.value, flipV: !state.value.flipV }
}

function reset(): void {
  state.value = { ...DEFAULT_STATE }
}

function save(): void {
  if (result.value && file.value) download(result.value.blob, file.value.name, format.value)
}

function clearAll(): void {
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
  file.value = null
  source.value = ''
  result.value = null
  error.value = ''
}

watch([state, format], () => void render(), { deep: true })
onBeforeUnmount(() => {
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
})
</script>

<template>
  <div class="rot">
    <FileDropZone v-if="!file" accept="image/*" hint="选择图片" :max-size="30 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="bar">
        <BaseButton size="sm" :disabled="busy" @click="rotate(-90)">↺ 左转 90°</BaseButton>
        <BaseButton size="sm" :disabled="busy" @click="rotate(90)">↻ 右转 90°</BaseButton>
        <BaseButton size="sm" :disabled="busy" @click="flip('h')">水平翻转</BaseButton>
        <BaseButton size="sm" :disabled="busy" @click="flip('v')">垂直翻转</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="reset">重置</BaseButton>
        <span class="bar__gap" />
        <div class="bar__fmt">
          <BaseSelect v-model="format" :options="formatOptions" size="sm" />
        </div>
        <BaseButton size="sm" variant="primary" :disabled="!result" @click="save">下载</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="clearAll">换一张</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="imgs">
        <figure class="img clay-card">
          <img :src="source" alt="原图" />
          <figcaption>原图 · {{ formatBytes(file.size) }}</figcaption>
        </figure>
        <figure v-if="result" class="img clay-card">
          <img :src="result.url" alt="变换后" />
          <figcaption>
            {{ result.width }} × {{ result.height }} · {{ formatBytes(result.blob.size) }} · 旋转 {{ state.angle }}°
            {{ state.flipH ? ' · 水平翻转' : '' }}{{ state.flipV ? ' · 垂直翻转' : '' }}
          </figcaption>
        </figure>
      </div>
    </template>
  </div>
</template>

<style scoped>
.rot {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__gap {
  flex: 1;
}
.bar__fmt {
  width: 170px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.imgs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
.img {
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-container-md);
}
.img img {
  width: 100%;
  height: 300px;
  object-fit: contain;
  background: var(--c-bg-subtle);
  display: block;
}
.img figcaption {
  padding: 7px 12px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid var(--c-border);
}
@media (max-width: 760px) {
  .imgs {
    grid-template-columns: 1fr;
  }
  .bar__fmt {
    width: 100%;
  }
}
</style>
