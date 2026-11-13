<script setup lang="ts">
import { computed, ref } from 'vue'
import { base64ToBlob, downloadBlob, extOf, readAsDataUrl, splitDataUrl } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import Field from '@/components/ui/Field.vue'
import { formatBytes } from '@/tools/dev/hash/logic'
import { toastError } from '@/core/toast'

type Mode = 'dataurl' | 'plain' | 'css'

const file = ref<File | null>(null)
const preview = ref('')
const dataUrl = ref('')
const mode = ref<Mode>('dataurl')
const busy = ref(false)
const error = ref('')

const pasted = ref('')
const restored = ref<{ url: string; blob: Blob; mime: string } | null>(null)

const modeOptions = [
  { label: '完整 DataURL', value: 'dataurl' },
  { label: '纯 Base64', value: 'plain' },
  { label: 'CSS background', value: 'css' },
]

const output = computed(() => {
  if (!dataUrl.value) return ''
  if (mode.value === 'dataurl') return dataUrl.value
  const parts = splitDataUrl(dataUrl.value)
  if (!parts) return ''
  return mode.value === 'plain' ? parts.base64 : `background-image: url("${dataUrl.value}");`
})

const parts = computed(() => (dataUrl.value ? splitDataUrl(dataUrl.value) : null))

async function onFiles(files: File[]): Promise<void> {
  const f = files[0]
  if (!f) return
  busy.value = true
  error.value = ''
  try {
    if (preview.value) URL.revokeObjectURL(preview.value)
    file.value = f
    preview.value = URL.createObjectURL(f)
    dataUrl.value = await readAsDataUrl(f)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    toastError(error.value)
  } finally {
    busy.value = false
  }
}

function clearFile(): void {
  if (preview.value) URL.revokeObjectURL(preview.value)
  file.value = null
  preview.value = ''
  dataUrl.value = ''
}

function parsePasted(): void {
  error.value = ''
  if (restored.value) URL.revokeObjectURL(restored.value.url)
  restored.value = null

  const text = pasted.value.trim()
  if (!text) return
  const parts = splitDataUrl(text.startsWith('data:') ? text : `data:image/png;base64,${text}`)
  if (!parts) {
    error.value = '没有识别出 Base64 数据，请检查是否包含 data:image/...;base64, 前缀'
    return
  }
  try {
    const blob = base64ToBlob(parts.base64, parts.mime)
    restored.value = { blob, url: URL.createObjectURL(blob), mime: parts.mime }
  } catch {
    error.value = 'Base64 内容不合法，解码失败'
  }
}

function saveRestored(): void {
  if (!restored.value) return
  downloadBlob(restored.value.blob, `restored.${extOf(restored.value.mime)}`)
}
</script>

<template>
  <div class="b64">
    <section class="block">
      <h3 class="block__title">图片 → Base64</h3>
      <FileDropZone v-if="!file" accept="image/*" hint="选择图片，或把图片拖进来" :max-size="8 * 1024 * 1024" @files="onFiles" />

      <template v-else>
        <div class="meta">
          <img v-if="preview" :src="preview" alt="预览" class="meta__thumb" />
          <div class="meta__info">
            <strong>{{ file.name }}</strong>
            <span class="u-xs u-dim">
              原图 {{ formatBytes(file.size) }} · Base64 后约 {{ formatBytes((parts?.base64.length ?? 0) * 0.75) }}
            </span>
            <span class="u-xs u-dim">类型 {{ parts?.mime ?? '未知' }} · 体积增加约 33%</span>
          </div>
          <BaseButton size="sm" variant="ghost" @click="clearFile">换一张</BaseButton>
        </div>

        <div class="bar">
          <div class="bar__select">
            <BaseSelect v-model="mode" :options="modeOptions" size="sm" />
          </div>
          <CopyButton :text="output" label="复制" />
          <span class="u-xs u-dim">{{ output.length.toLocaleString('zh-CN') }} 字符</span>
        </div>

        <BaseTextarea :model-value="output" :rows="6" readonly />
      </template>
    </section>

    <section class="block">
      <h3 class="block__title">Base64 → 图片</h3>
      <Field label="粘贴 DataURL 或纯 Base64" hint="纯 Base64 默认按 PNG 还原">
        <BaseTextarea v-model="pasted" :rows="4" placeholder="data:image/png;base64,iVBORw0KGgo…" />
      </Field>
      <div class="bar">
        <BaseButton size="sm" variant="primary" :disabled="!pasted.trim() || busy" @click="parsePasted">解析</BaseButton>
        <BaseButton size="sm" :disabled="!restored" @click="saveRestored">下载图片</BaseButton>
        <span v-if="error" class="err">{{ error }}</span>
      </div>
      <div v-if="restored" class="restored clay-card">
        <img :src="restored.url" alt="还原结果" />
        <div class="restored__foot">
          {{ restored.mime }} · {{ formatBytes(restored.blob.size) }}
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.b64 {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}
.block {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.block__title {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  font-weight: 600;
}
.meta {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.meta__thumb {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: var(--radius-control-sm);
  background: var(--c-bg-subtle);
}
.meta__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__select {
  width: 180px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
}
.restored {
  border-radius: var(--radius-container-md);
  overflow: hidden;
}
.restored img {
  display: block;
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  background: var(--c-bg-subtle);
}
.restored__foot {
  padding: 7px 12px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid var(--c-border);
}
</style>
