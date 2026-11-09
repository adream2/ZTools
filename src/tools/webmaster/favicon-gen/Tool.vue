<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { HTML_SNIPPET, buildIco, download, generateIcons, type IconFile } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import { toastError } from '@/core/toast'

const icons = ref<IconFile[]>([])
const source = ref('')
const busy = ref(false)
const error = ref('')

async function onFiles(files: File[]): Promise<void> {
  const file = files[0]
  if (!file) return
  error.value = ''
  busy.value = true
  try {
    if (source.value) URL.revokeObjectURL(source.value)
    source.value = URL.createObjectURL(file)
    icons.value.forEach((i) => URL.revokeObjectURL(i.url))
    icons.value = await generateIcons(file)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

async function saveIco(): Promise<void> {
  try {
    const blob = await buildIco(icons.value)
    download(blob, 'favicon.ico')
  } catch (e) {
    toastError(e instanceof Error ? e.message : String(e))
  }
}

function reset(): void {
  icons.value.forEach((i) => URL.revokeObjectURL(i.url))
  if (source.value) URL.revokeObjectURL(source.value)
  icons.value = []
  source.value = ''
}

onBeforeUnmount(() => {
  icons.value.forEach((i) => URL.revokeObjectURL(i.url))
  if (source.value) URL.revokeObjectURL(source.value)
})
</script>

<template>
  <div class="fav">
    <FileDropZone v-if="!icons.length" accept="image/*" hint="选择一张正方形图片" :max-size="10 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="bar">
        <img :src="source" class="bar__src" alt="原图" />
        <div class="u-xs u-dim">已生成 {{ icons.length }} 个尺寸，建议原图不小于 512×512</div>
        <span class="bar__gap" />
        <BaseButton size="sm" :loading="busy" @click="saveIco">下载 ICO</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="reset">换一张</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="grid">
        <div v-for="icon in icons" :key="icon.size" class="item clay-card">
          <img :src="icon.url" :alt="`${icon.size}px`" />
          <div class="item__meta">
            <span class="item__size">{{ icon.size }}×{{ icon.size }}</span>
            <code class="item__name">{{ icon.name }}</code>
          </div>
          <BaseButton size="sm" variant="ghost" @click="download(icon.blob, icon.name)">下载</BaseButton>
        </div>
      </div>

      <div class="snippet clay-inset">
        <div class="snippet__head">
          <span class="u-xs u-dim">HTML 引用</span>
          <CopyButton :text="HTML_SNIPPET" />
        </div>
        <pre class="snippet__code">{{ HTML_SNIPPET }}</pre>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fav {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.bar__src {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-control-sm);
  object-fit: cover;
  box-shadow: var(--clay-raised-sm);
}
.bar__gap {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--sp-2);
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--sp-3);
  border-radius: var(--radius-container-sm);
}
.item img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  image-rendering: auto;
}
.item__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.item__size {
  font-size: var(--fs-sm);
  font-weight: 500;
}
.item__name {
  font-size: 10px;
  color: var(--c-text-3);
}
.snippet {
  padding: var(--sp-3);
  border-radius: var(--radius-container-sm);
}
.snippet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.snippet__code {
  margin: 0;
  font-size: var(--fs-xs);
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--c-text-2);
}
</style>
