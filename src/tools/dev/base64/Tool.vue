<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  base64ToBlob,
  decodeText,
  encodeText,
  fileToBase64,
  isProbablyBase64,
  sniffMime,
} from './logic'
import { formatBytes } from '../json-formatter/logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import { toastError, toastOk } from '@/core/toast'

const mode = ref('text')
const tabs = [
  { id: 'text', label: '文本' },
  { id: 'file', label: '文件' },
]

const input = ref('')
const output = ref('')
const urlSafe = ref(false)
const error = ref('')

const fileBase64 = ref('')
const fileName = ref('')
const fileSize = ref(0)
const withPrefix = ref(false)
const rawFile = ref<File | null>(null)

const canDecode = computed(() => isProbablyBase64(input.value))

function encode(): void {
  error.value = ''
  try {
    output.value = encodeText(input.value, urlSafe.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

function decode(): void {
  error.value = ''
  try {
    output.value = decodeText(input.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

function swap(): void {
  if (!output.value) return
  input.value = output.value
  output.value = ''
}

async function onFiles(files: File[]): Promise<void> {
  const file = files[0]
  if (!file) return
  if (file.size > 20 * 1024 * 1024) {
    toastError('文件超过 20 MB')
    return
  }
  rawFile.value = file
  fileBase64.value = await fileToBase64(file, withPrefix.value)
  fileName.value = file.name
  fileSize.value = file.size
}

async function togglePrefix(value: boolean): Promise<void> {
  withPrefix.value = value
  if (rawFile.value) fileBase64.value = await fileToBase64(rawFile.value, value)
}

function download(): void {
  const raw = input.value.replace(/^data:[^;]+;base64,/, '')
  if (!raw.trim()) return
  try {
    const blob = base64ToBlob(raw, sniffMime(raw))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `decoded-${Date.now()}`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    toastError(e instanceof Error ? e.message : String(e))
  }
}

async function copyFile(): Promise<void> {
  await navigator.clipboard.writeText(fileBase64.value)
  toastOk('已复制')
}

function clearText(): void {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>

<template>
  <div class="b64">
    <BaseTabs v-model="mode" :tabs="tabs" />

    <template v-if="mode === 'text'">
      <div class="bar">
        <BaseButton variant="primary" size="sm" @click="encode">编码 →</BaseButton>
        <BaseButton size="sm" :disabled="!canDecode" @click="decode">← 解码</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="swap">结果转输入</BaseButton>
        <label class="bar__check"><BaseSwitch v-model="urlSafe" /><span>URL-safe</span></label>
        <span class="bar__gap" />
        <BaseButton size="sm" variant="ghost" @click="clearText">清空</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="split">
        <Field label="输入">
          <BaseTextarea v-model="input" :rows="12" placeholder="纯文本或 Base64 字符串…" />
        </Field>
        <Field label="输出">
          <div class="out">
            <div class="out__bar">
              <span class="u-xs u-dim">{{ output ? `${output.length} 字符` : '结果会出现在这里' }}</span>
              <CopyButton :text="output" />
            </div>
            <BaseTextarea v-model="output" :rows="12" readonly placeholder="尚无输出" class="out__ta" />
          </div>
        </Field>
      </div>

      <p class="tip">URL-safe 变体把 <code>+</code>/<code>/</code> 换成 <code>-</code>/<code>_</code> 并去掉尾部 <code>=</code>，适合放进 URL 与 JWT。</p>
    </template>

    <template v-else>
      <FileDropZone accept="*/*" hint="选择任意文件" :max-size="20 * 1024 * 1024" @files="onFiles" />

      <div v-if="fileBase64" class="file">
        <div class="file__head">
          <div>
            <div class="file__name">{{ fileName }}</div>
            <div class="u-xs u-dim">{{ formatBytes(fileSize) }} → {{ formatBytes(fileBase64.length) }} 字符</div>
          </div>
          <div class="u-row">
            <label class="bar__check"><BaseSwitch :model-value="withPrefix" @update:model-value="togglePrefix" /><span>带 Data URL 前缀</span></label>
            <CopyButton :text="fileBase64" size="md" />
          </div>
        </div>
        <BaseTextarea :model-value="fileBase64" :rows="8" readonly />
      </div>

      <div class="file">
        <Field label="Base64 还原为文件" hint="粘贴 Base64 或 Data URL，自动识别类型">
          <BaseTextarea v-model="input" :rows="6" placeholder="data:image/png;base64,iVBORw0…" />
        </Field>
        <div class="u-row">
          <BaseButton size="sm" :disabled="!input.trim()" @click="download">下载文件</BaseButton>
          <span class="u-xs u-dim">识别类型：{{ input.trim() ? sniffMime(input) : '—' }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.b64 {
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
.bar__check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.bar__gap {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 10px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-subtle);
}
.out__ta {
  border: none;
  border-radius: 0;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.tip code {
  background: var(--c-bg-subtle);
  padding: 1px 4px;
  border-radius: 3px;
}
.file {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
}
.file__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.file__name {
  font-size: var(--fs-sm);
  font-weight: 500;
}
</style>
