<script setup lang="ts">
import { ref, watch } from 'vue'
import { ALGOS, hashFile, hashTextAll, formatBytes, type HashAlgo } from './logic'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'

const mode = ref('text')
const tabs = [
  { id: 'text', label: '文本' },
  { id: 'file', label: '文件' },
]

const input = ref('')
const textHashes = ref<Partial<Record<HashAlgo, string>>>({})
const busy = ref(false)
const error = ref('')

const fileName = ref('')
const fileSize = ref(0)
const fileHashes = ref<Partial<Record<HashAlgo, string>>>({})
const fileProgress = ref(0)

let timer: ReturnType<typeof setTimeout> | undefined

watch(input, () => {
  clearTimeout(timer)
  if (!input.value) {
    textHashes.value = {}
    return
  }
  timer = setTimeout(() => void computeText(), 300)
})

async function computeText(): Promise<void> {
  busy.value = true
  error.value = ''
  try {
    textHashes.value = await hashTextAll(input.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

async function onFiles(files: File[]): Promise<void> {
  const file = files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024 * 1024) {
    error.value = '文件超过 2 GB，浏览器无法可靠处理'
    return
  }

  fileName.value = file.name
  fileSize.value = file.size
  fileHashes.value = {}
  error.value = ''
  busy.value = true
  fileProgress.value = 0

  try {
    for (const algo of ALGOS) {
      fileHashes.value = { ...fileHashes.value, [algo.id]: await hashFile(file, algo.id, (p) => (fileProgress.value = p)) }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
    fileProgress.value = 1
  }
}
</script>

<template>
  <div class="hash">
    <BaseTabs v-model="mode" :tabs="tabs" />

    <p v-if="error" class="err">{{ error }}</p>

    <template v-if="mode === 'text'">
      <Field label="输入文本" hint="自动计算全部算法，无需选择">
        <BaseTextarea v-model="input" :rows="8" placeholder="要计算摘要的文本…" />
      </Field>

      <div class="list">
        <div v-for="algo in ALGOS" :key="algo.id" class="row">
          <span class="row__algo">
            {{ algo.label }}
            <span v-if="algo.weak" class="row__weak" title="仅用于兼容旧系统，不适合安全场景">弱</span>
          </span>
          <code class="row__val" :class="{ 'is-empty': !textHashes[algo.id] }">
            {{ textHashes[algo.id] || (busy ? '计算中…' : '—') }}
          </code>
          <CopyButton :text="textHashes[algo.id] || ''" label="" variant="ghost" />
        </div>
      </div>
    </template>

    <template v-else>
      <FileDropZone hint="选择文件计算摘要" :max-size="2 * 1024 * 1024 * 1024" @files="onFiles" />

      <div v-if="fileName" class="file">
        <div class="file__head">
          <div>
            <div class="file__name">{{ fileName }}</div>
            <div class="u-xs u-dim">{{ formatBytes(fileSize) }}</div>
          </div>
          <div v-if="busy" class="u-xs u-dim">计算中 {{ Math.round(fileProgress * 100) }}%</div>
        </div>

        <div class="list">
          <div v-for="algo in ALGOS" :key="algo.id" class="row">
            <span class="row__algo">{{ algo.label }}</span>
            <code class="row__val" :class="{ 'is-empty': !fileHashes[algo.id] }">{{ fileHashes[algo.id] || '—' }}</code>
            <CopyButton :text="fileHashes[algo.id] || ''" label="" variant="ghost" />
          </div>
        </div>
      </div>

      <p class="tip">MD5 走分块流式读取，大文件不会一次性占满内存；SHA 系列受浏览器 API 限制需要整体读入，超大文件可能较慢。</p>
    </template>
  </div>
</template>

<style scoped>
.hash {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.list {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 7px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
}
.row:last-child {
  border-bottom: none;
}
.row:hover {
  background: var(--c-bg-subtle);
}
.row__algo {
  width: 84px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-2);
  display: flex;
  align-items: center;
  gap: 4px;
}
.row__weak {
  font-size: 10px;
  color: var(--c-warn);
  background: var(--c-warn-weak);
  border-radius: 3px;
  padding: 0 3px;
}
.row__val {
  flex: 1;
  font-size: var(--fs-sm);
  word-break: break-all;
  user-select: all;
}
.row__val.is-empty {
  color: var(--c-text-3);
}
.file {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.file__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
}
.file__name {
  font-size: var(--fs-sm);
  font-weight: 500;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
