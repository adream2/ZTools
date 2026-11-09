<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { DEFAULT_OPTIONS, POSITIONS, applyWatermark, download, type Position, type WatermarkOptions } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import Field from '@/components/ui/Field.vue'

const file = ref<File | null>(null)
const source = ref('')
const options = ref<WatermarkOptions>({ ...DEFAULT_OPTIONS })
const result = ref<{ blob: Blob; url: string } | null>(null)
const busy = ref(false)
const error = ref('')

const positionOptions = POSITIONS.map((p) => ({ label: p.label, value: p.id }))

async function render(): Promise<void> {
  if (!file.value) return
  busy.value = true
  error.value = ''
  try {
    if (result.value) URL.revokeObjectURL(result.value.url)
    result.value = await applyWatermark(file.value, options.value)
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
  await render()
}

function setPosition(id: string | number): void {
  options.value = { ...options.value, position: id as Position }
}

function save(): void {
  if (result.value && file.value) download(result.value.blob, file.value.name, 'image/png')
}

function reset(): void {
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
  file.value = null
  source.value = ''
  result.value = null
}

watch(options, () => void render(), { deep: true })
onBeforeUnmount(() => {
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
})
</script>

<template>
  <div class="wm">
    <FileDropZone v-if="!file" accept="image/*" hint="选择图片" :max-size="30 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="bar">
        <div class="bar__grow">
          <Field label="水印文字">
            <BaseInput v-model="options.text" placeholder="© 你的名字" />
          </Field>
        </div>
        <div class="bar__f">
          <Field label="位置">
            <BaseSelect :model-value="options.position" :options="positionOptions" @update:model-value="setPosition" />
          </Field>
        </div>
        <div class="bar__n">
          <Field label="不透明度 %">
            <BaseInput
              :model-value="String(options.opacity)"
              type="number"
              mono
              @update:model-value="options.opacity = Number($event)"
            />
          </Field>
        </div>
        <div class="bar__n">
          <Field label="字号 %">
            <BaseInput :model-value="String(options.size)" type="number" mono @update:model-value="options.size = Number($event)" />
          </Field>
        </div>
        <label class="chk"><BaseSwitch v-model="options.rotate" /><span>倾斜</span></label>
        <span class="bar__gap" />
        <BaseButton size="sm" variant="primary" :disabled="!result" @click="save">下载</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="reset">换一张</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="imgs">
        <figure class="img clay-card">
          <img :src="source" alt="原图" />
          <figcaption>原图</figcaption>
        </figure>
        <figure v-if="result" class="img clay-card">
          <img :src="result.url" alt="加水印后" />
          <figcaption>加水印</figcaption>
        </figure>
      </div>

      <p class="u-xs u-dim">字号按图片短边的百分比计算，横图竖图都能保持相对大小。</p>
    </template>
  </div>
</template>

<style scoped>
.wm {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__grow {
  flex: 1;
  min-width: 180px;
}
.bar__f {
  width: 120px;
}
.bar__n {
  width: 92px;
}
.bar__gap {
  flex: 1;
}
.chk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  padding-bottom: 10px;
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
  height: 320px;
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
}
</style>
