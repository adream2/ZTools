<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { decodeImage, type QrDecodeResult } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'

const preview = ref('')
const result = ref<QrDecodeResult | null>(null)
const error = ref('')
const busy = ref(false)

async function onFiles(files: File[]): Promise<void> {
  const file = files[0]
  if (!file) return
  error.value = ''
  result.value = null
  busy.value = true
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = URL.createObjectURL(file)

  try {
    result.value = await decodeImage(file)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

function reset(): void {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = ''
  result.value = null
  error.value = ''
}

onBeforeUnmount(() => {
  if (preview.value) URL.revokeObjectURL(preview.value)
})

const isUrl = (text: string) => /^https?:\/\//i.test(text)
</script>

<template>
  <div class="qrd">
    <FileDropZone v-if="!preview" accept="image/*" hint="选择带二维码的图片" :max-size="20 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="layout">
        <div class="pic clay-card">
          <img :src="preview" alt="待识别图片" />
        </div>

        <div class="info">
          <div v-if="busy" class="u-sm u-dim">识别中…</div>

          <template v-else-if="result">
            <div class="block clay-list">
              <div class="block__bar">
                <span class="u-xs u-dim">识别结果</span>
                <CopyButton :text="result.data" />
              </div>
              <code class="block__text">{{ result.data }}</code>
            </div>

            <div class="meta">
              <span>版本 <b>v{{ result.version }}</b></span>
              <span>长度 <b>{{ result.data.length }}</b></span>
            </div>

            <a v-if="isUrl(result.data)" :href="result.data" target="_blank" rel="noopener noreferrer" class="link">
              打开链接 ↗
            </a>
          </template>

          <p v-if="error" class="err">{{ error }}</p>

          <BaseButton size="sm" variant="ghost" @click="reset">换一张</BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.qrd {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--sp-3);
  align-items: start;
}
.pic {
  padding: var(--sp-3);
  border-radius: var(--radius-container-md);
}
.pic img {
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  border-radius: var(--radius-control-sm);
}
.info {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: flex-start;
}
.block {
  width: 100%;
  overflow: hidden;
}
.block__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 10px;
  border-bottom: 1px solid var(--c-border);
}
.block__text {
  display: block;
  padding: var(--sp-3);
  font-size: var(--fs-sm);
  word-break: break-all;
  white-space: pre-wrap;
  user-select: all;
}
.meta {
  display: flex;
  gap: var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.meta b {
  color: var(--c-text-2);
  font-family: var(--font-mono);
}
.link {
  font-size: var(--fs-sm);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
@media (max-width: 760px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
