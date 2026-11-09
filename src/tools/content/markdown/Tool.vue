<script setup lang="ts">
import { computed, ref } from 'vue'
import { SAMPLE, countText, exportHtml, renderMarkdown } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'
import { toastOk } from '@/core/toast'

const md = ref(SAMPLE)

const html = computed(() => renderMarkdown(md.value))
const stats = computed(() => countText(md.value))

function loadSample(): void {
  md.value = SAMPLE
}

function clear(): void {
  md.value = ''
}

function downloadHtml(): void {
  const doc = exportHtml(md.value, 'ZT 工具箱 · Markdown 导出')
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'markdown-export.html'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  toastOk('已导出单文件 HTML')
}
</script>

<template>
  <div class="md">
    <div class="bar">
      <span class="u-xs u-dim">
        {{ stats.cjk }} 汉字 · {{ stats.words }} 词 · {{ stats.paragraphs }} 段 · 约 {{ stats.readMinutes }} 分钟读完
      </span>
      <span class="bar__gap" />
      <BaseButton size="sm" variant="ghost" @click="loadSample">示例</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clear">清空</BaseButton>
      <CopyButton :text="html" label="复制 HTML" />
      <BaseButton size="sm" @click="downloadHtml">导出 HTML</BaseButton>
    </div>

    <div class="split">
      <Field label="Markdown">
        <BaseTextarea v-model="md" :rows="22" placeholder="在这里写 Markdown…" />
      </Field>

      <Field label="预览" hint="已净化，脚本与内联事件会被移除">
        <div class="preview">
          <div v-if="html" class="preview__body" v-html="html" />
          <div v-else class="preview__empty">左侧输入后实时渲染</div>
        </div>
      </Field>
    </div>
  </div>
</template>

<style scoped>
.md {
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
.preview {
  height: 100%;
  min-height: 440px;
  max-height: 70vh;
  overflow: auto;
  padding: var(--sp-4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
}
.preview__empty {
  color: var(--c-text-3);
  font-size: var(--fs-sm);
  text-align: center;
  padding-top: var(--sp-6);
}
.preview__body {
  font-size: var(--fs-md);
  line-height: 1.75;
  color: var(--c-text);
  word-break: break-word;
}
.preview__body :deep(h1),
.preview__body :deep(h2),
.preview__body :deep(h3),
.preview__body :deep(h4) {
  margin: 1.4em 0 0.5em;
  line-height: 1.3;
}
.preview__body :deep(h1:first-child) {
  margin-top: 0;
}
.preview__body :deep(h1) {
  font-size: 1.7em;
}
.preview__body :deep(h2) {
  font-size: 1.35em;
}
.preview__body :deep(h3) {
  font-size: 1.15em;
}
.preview__body :deep(p) {
  margin: 0 0 0.9em;
}
.preview__body :deep(ul),
.preview__body :deep(ol) {
  padding-left: 1.4em;
  margin: 0 0 0.9em;
}
.preview__body :deep(li) {
  margin-bottom: 0.25em;
}
.preview__body :deep(a) {
  color: var(--c-accent);
}
.preview__body :deep(code) {
  background: var(--c-bg-subtle);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}
.preview__body :deep(pre) {
  background: var(--c-code-bg);
  border: 1px solid var(--c-border);
  padding: var(--sp-3);
  border-radius: var(--radius-sm);
  overflow: auto;
  margin: 0 0 0.9em;
}
.preview__body :deep(pre code) {
  background: none;
  padding: 0;
}
.preview__body :deep(blockquote) {
  margin: 0 0 0.9em;
  padding-left: 12px;
  border-left: 3px solid var(--c-border-strong);
  color: var(--c-text-2);
}
.preview__body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}
.preview__body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0 0 0.9em;
  font-size: var(--fs-sm);
}
.preview__body :deep(th),
.preview__body :deep(td) {
  border: 1px solid var(--c-border);
  padding: 6px 10px;
  text-align: left;
}
.preview__body :deep(th) {
  background: var(--c-bg-subtle);
}
.preview__body :deep(hr) {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 1.4em 0;
}
</style>
