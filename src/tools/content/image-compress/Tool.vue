<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  FORMAT_LABEL,
  MAX_FILE,
  compressImage,
  download,
  formatBytes,
  supportsWebp,
  type CompressResult,
  type OutputFormat,
} from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import Field from '@/components/ui/Field.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import PrivacyBadge from '@/components/ui/PrivacyBadge.vue'

const file = ref<File | null>(null)
const originalUrl = ref('')
const result = ref<CompressResult | null>(null)
const error = ref('')
const busy = ref(false)

const format = ref<OutputFormat>(supportsWebp() ? 'image/webp' : 'image/jpeg')
const quality = ref('78')
const maxEdge = ref('1600')

const formatOptions = computed(() => {
  const list = [
    { label: 'WebP · 体积最小', value: 'image/webp' },
    { label: 'JPEG · 兼容最好', value: 'image/jpeg' },
    { label: 'PNG · 无损', value: 'image/png' },
  ]
  return supportsWebp() ? list : list.filter((o) => o.value !== 'image/webp')
})

const edgeOptions = [
  { label: '不缩放', value: '0' },
  { label: '最长边 4000', value: '4000' },
  { label: '最长边 2400', value: '2400' },
  { label: '最长边 1600', value: '1600' },
  { label: '最长边 1200', value: '1200' },
  { label: '最长边 800', value: '800' },
]

async function onFiles(files: File[]): Promise<void> {
  const f = files[0]
  if (!f) return
  error.value = ''
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  file.value = f
  originalUrl.value = URL.createObjectURL(f)
  result.value = null
  await run()
}

async function run(): Promise<void> {
  if (!file.value) return
  busy.value = true
  error.value = ''
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  try {
    result.value = await compressImage(file.value, {
      format: format.value,
      quality: Number(quality.value) / 100,
      maxEdge: Number(maxEdge.value),
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    result.value = null
  } finally {
    busy.value = false
  }
}

watch([format, quality, maxEdge], () => void run())

onBeforeUnmount(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
})

function save(): void {
  if (result.value && file.value) download(result.value.blob, file.value.name, format.value)
}

function reset(): void {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (result.value?.url) URL.revokeObjectURL(result.value.url)
  file.value = null
  originalUrl.value = ''
  result.value = null
  error.value = ''
}
</script>

<template>
  <div class="ic">
    <FileDropZone
      v-if="!file"
      accept="image/*"
      hint="选择图片"
      :max-size="MAX_FILE"
      @files="onFiles"
    />

    <template v-else>
      <div class="bar">
        <div class="bar__f">
          <Field label="格式">
            <BaseSelect v-model="format" :options="formatOptions" />
          </Field>
        </div>
        <div class="bar__f">
          <Field label="最长边">
            <BaseSelect v-model="maxEdge" :options="edgeOptions" />
          </Field>
        </div>
        <div class="bar__q">
          <Field :label="`质量 ${quality}%`" hint="PNG 忽略此项">
            <input v-model="quality" type="range" min="10" max="100" class="range" :disabled="format === 'image/png'" />
          </Field>
        </div>
        <BaseButton size="sm" variant="ghost" @click="reset">换一张</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div v-if="result" class="result">
        <div class="imgs">
          <figure class="img">
            <img :src="originalUrl" alt="原图" />
            <figcaption>原图 · {{ formatBytes(result.originalSize) }}</figcaption>
          </figure>
          <figure class="img">
            <img :src="result.url" alt="压缩后" />
            <figcaption>{{ FORMAT_LABEL[format] }} · {{ formatBytes(result.outputSize) }}</figcaption>
          </figure>
        </div>

        <div class="stats">
          <div class="stat">
            <span class="stat__k">体积变化</span>
            <span :class="['stat__v', result.ratio > 0 ? 'is-ok' : 'is-bad']">
              {{ result.ratio > 0 ? `减少 ${result.ratio}%` : `增加 ${Math.abs(result.ratio)}%` }}
            </span>
          </div>
          <div class="stat">
            <span class="stat__k">输出尺寸</span>
            <span class="stat__v u-mono">{{ result.width }} × {{ result.height }}</span>
          </div>
          <div class="stat">
            <span class="stat__k">对比</span>
            <span class="stat__v u-mono">{{ formatBytes(result.originalSize) }} → {{ formatBytes(result.outputSize) }}</span>
          </div>
          <BaseButton variant="primary" :loading="busy" @click="save">下载</BaseButton>
        </div>
      </div>

      <div class="u-row">
        <PrivacyBadge level="local" />
        <span class="u-xs u-dim">图片只在本机解码与编码，不会上传。</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ic {
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
  width: 170px;
}
.bar__q {
  flex: 1;
  min-width: 180px;
}
.range {
  width: 100%;
  accent-color: var(--c-accent);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.result {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.imgs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
.img {
  margin: 0;
  border-radius: var(--radius-container-md);
  overflow: hidden;
  background: var(--c-bg-subtle);
  box-shadow: var(--clay-inset);
}
.img img {
  width: 100%;
  height: 240px;
  object-fit: contain;
  display: block;
}
.img figcaption {
  padding: 6px 10px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
}
.stats {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
  flex-wrap: wrap;
  padding: var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: var(--c-bg-subtle);
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.stat__k {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.stat__v {
  font-size: var(--fs-md);
  font-weight: 500;
}
.stat__v.is-ok {
  color: var(--c-ok);
}
.stat__v.is-bad {
  color: var(--c-danger);
}
.stats > :last-child {
  margin-left: auto;
}
@media (max-width: 640px) {
  .imgs {
    grid-template-columns: 1fr;
  }
  .stats > :last-child {
    margin-left: 0;
  }
}
</style>
