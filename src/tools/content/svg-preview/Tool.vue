<script setup lang="ts">
import { computed, ref } from 'vue'
import { SAMPLE, download, optimizeSvg, sanitizeSvg, svgToPng } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'
import { toastError, toastOk } from '@/core/toast'

const code = ref(SAMPLE)
const bg = ref('checker')
const scale = ref('2')

const bgTabs = [
  { id: 'checker', label: '棋盘' },
  { id: 'white', label: '白色' },
  { id: 'dark', label: '深色' },
]

const scaleOptions = [
  { id: '1', label: '1x' },
  { id: '2', label: '2x' },
  { id: '3', label: '3x' },
]

const parsed = computed(() => {
  try {
    return { info: sanitizeSvg(code.value), error: '' }
  } catch (e) {
    return { info: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const optimized = computed(() => (parsed.value.info ? optimizeSvg(parsed.value.info.svg) : ''))

async function exportPng(): Promise<void> {
  const info = parsed.value.info
  if (!info) return
  try {
    const blob = await svgToPng(info.svg, info.width, Number(scale.value))
    download(blob, `svg-${info.width}x${info.height}@${scale.value}x.png`)
    toastOk('已导出 PNG')
  } catch (e) {
    toastError(e instanceof Error ? e.message : String(e))
  }
}

function exportSvg(): void {
  const info = parsed.value.info
  if (!info) return
  download(new Blob([optimized.value], { type: 'image/svg+xml;charset=utf-8' }), 'graphic.svg')
}

async function onFile(e: Event): Promise<void> {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 4 * 1024 * 1024) {
    toastError('SVG 文件超过 4 MB')
    return
  }
  code.value = await file.text()
  ;(e.target as HTMLInputElement).value = ''
}

const bgClass = computed(() => `bg--${bg.value}`)
</script>

<template>
  <div class="svg">
    <div class="bar">
      <BaseButton size="sm" variant="ghost" @click="code = SAMPLE">示例</BaseButton>
      <label class="upload">
        选择 SVG
        <input type="file" accept=".svg,image/svg+xml" @change="onFile" />
      </label>
      <BaseButton size="sm" variant="ghost" @click="code = ''">清空</BaseButton>
      <span class="bar__gap" />
      <BaseTabs v-model="bg" :tabs="bgTabs" />
    </div>

    <div class="split">
      <Field label="SVG 源码">
        <BaseTextarea v-model="code" :rows="20" placeholder="<svg>…</svg>" :invalid="!!parsed.error" />
      </Field>

      <Field label="预览" :hint="parsed.info ? `${parsed.info.width} × ${parsed.info.height}` : ''">
        <div :class="['preview', bgClass]">
          <div v-if="parsed.info" class="preview__inner" v-html="parsed.info.svg" />
          <div v-else class="preview__empty">{{ parsed.error || '左侧输入 SVG 代码' }}</div>
        </div>
      </Field>
    </div>

    <div v-if="parsed.info" class="meta">
      <span>尺寸 <b>{{ parsed.info.width }} × {{ parsed.info.height }}</b></span>
      <span>viewBox <b>{{ parsed.info.viewBox || '未声明' }}</b></span>
      <span>源码 <b>{{ (parsed.info.size / 1024).toFixed(1) }} KB</b></span>
      <span>优化后 <b>{{ (new Blob([optimized]).size / 1024).toFixed(1) }} KB</b></span>
    </div>

    <div v-if="parsed.info?.warnings.length" class="warns">
      <div v-for="(w, i) in parsed.info.warnings" :key="i" class="warn">{{ w }}</div>
    </div>

    <div class="actions">
      <BaseTabs v-model="scale" :tabs="scaleOptions" />
      <BaseButton variant="primary" size="sm" :disabled="!parsed.info" @click="exportPng">导出 PNG</BaseButton>
      <BaseButton size="sm" :disabled="!parsed.info" @click="exportSvg">下载 SVG</BaseButton>
      <CopyButton :text="optimized" label="复制优化后代码" size="md" />
    </div>

    <p class="tip">
      预览前会移除 <code>&lt;script&gt;</code>、<code>&lt;foreignObject&gt;</code> 与所有 <code>on*</code> 事件属性，防止内嵌脚本执行。
    </p>
  </div>
</template>

<style scoped>
.svg {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.bar__gap {
  flex: 1;
}
.upload {
  position: relative;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  border-radius: var(--radius-container-sm);
  padding: 5px 10px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.upload:hover {
  border-color: var(--c-border-strong);
  color: var(--c-text);
}
.upload input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.preview {
  min-height: 440px;
  max-height: 70vh;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  padding: var(--sp-4);
  overflow: auto;
}
.bg--checker {
  background: repeating-conic-gradient(var(--c-bg-subtle) 0% 25%, var(--c-surface) 0% 50%) 50% / 20px 20px;
}
.bg--white {
  background: #ffffff;
}
.bg--dark {
  background: #17181c;
}
.preview__inner :deep(svg) {
  max-width: 100%;
  height: auto;
  display: block;
}
.preview__empty {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
  text-align: center;
  padding: var(--sp-4);
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-4);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.meta b {
  color: var(--c-text-2);
  font-weight: 500;
  font-family: var(--font-mono);
}
.warns {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.warn {
  font-size: var(--fs-xs);
  color: var(--c-warn);
  background: var(--c-warn-weak);
  padding: 5px 8px;
  border-radius: var(--radius-sm);
}
.actions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
.tip code {
  background: var(--c-bg-subtle);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
