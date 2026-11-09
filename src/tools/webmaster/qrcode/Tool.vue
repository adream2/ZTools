<script setup lang="ts">
import { computed, ref } from 'vue'
import { DEFAULT_OPTIONS, capacityHint, download, makeSvg, svgToPng, type Ecc, type QrOptions } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import Field from '@/components/ui/Field.vue'
import { toastError } from '@/core/toast'

const text = ref('https://ztsite.com')
const options = ref<QrOptions>({ ...DEFAULT_OPTIONS })

const svg = computed(() => {
  try {
    return makeSvg(text.value, options.value)
  } catch (e) {
    return `ERROR:${e instanceof Error ? e.message : String(e)}`
  }
})

const error = computed(() => (svg.value.startsWith('ERROR:') ? svg.value.slice(6) : ''))
const printable = computed(() => (error.value ? '' : svg.value))

const eccOptions = [
  { label: 'L · 低（7%）', value: 'L' },
  { label: 'M · 中（15%）', value: 'M' },
  { label: 'Q · 较高（25%）', value: 'Q' },
  { label: 'H · 高（30%）', value: 'H' },
]

const sizeOptions = [
  { label: '256 px', value: '256' },
  { label: '320 px', value: '320' },
  { label: '480 px', value: '480' },
  { label: '640 px', value: '640' },
]

const ecc = computed({
  get: () => options.value.ecc,
  set: (v: string | number) => (options.value.ecc = v as Ecc),
})

const size = computed({
  get: () => String(options.value.size),
  set: (v: string | number) => (options.value.size = Number(v)),
})

function downloadSvg(): void {
  if (!printable.value) return
  download(new Blob([printable.value], { type: 'image/svg+xml;charset=utf-8' }), 'qrcode.svg')
}

async function downloadPng(): Promise<void> {
  if (!printable.value) return
  try {
    const blob = await svgToPng(printable.value, options.value.size)
    download(blob, 'qrcode.png')
  } catch (e) {
    toastError(e instanceof Error ? e.message : String(e))
  }
}
</script>

<template>
  <div class="qr">
    <div class="qr__main">
      <div class="split">
        <div class="u-stack">
          <Field label="内容" hint="网址、文本、Wi-Fi 配置都可以">
            <BaseTextarea v-model="text" :rows="5" mono placeholder="https://example.com" />
          </Field>

          <div class="opts">
            <Field label="纠错级别">
              <BaseSelect v-model="ecc" :options="eccOptions" />
            </Field>
            <Field label="导出尺寸">
              <BaseSelect v-model="size" :options="sizeOptions" />
            </Field>
          </div>

          <div class="opts">
            <Field label="前景色">
              <input v-model="options.dark" type="color" class="color" />
            </Field>
            <Field label="背景色">
              <input v-model="options.light" type="color" class="color" :disabled="options.transparent" />
            </Field>
          </div>

          <div class="row">
            <label class="chk"><BaseSwitch v-model="options.transparent" /><span>透明背景</span></label>
            <div class="row__margin">
              <span class="u-xs u-dim">留白</span>
              <BaseInput
                :model-value="String(options.margin)"
                type="number"
                size="sm"
                @update:model-value="options.margin = Math.min(10, Math.max(0, Number($event) || 0))"
              />
            </div>
          </div>

          <p class="cap">该级别大约可容纳 {{ capacityHint(options.ecc) }}，超出会提示失败。</p>
        </div>

        <div class="preview">
          <div class="preview__box" :style="{ background: options.transparent ? 'repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 16px 16px' : options.light }">
            <div v-if="printable" class="preview__svg" v-html="printable" />
            <div v-else class="preview__empty">输入内容后生成</div>
          </div>
          <p v-if="error" class="err">{{ error }}</p>
          <div class="preview__actions">
            <BaseButton size="sm" variant="primary" :disabled="!printable" @click="downloadPng">下载 PNG</BaseButton>
            <BaseButton size="sm" :disabled="!printable" @click="downloadSvg">下载 SVG</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.opts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
.color {
  width: 100%;
  height: 34px;
  padding: 2px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  cursor: pointer;
}
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.chk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.row__margin {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 120px;
}
.cap {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.preview {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: center;
}
.preview__box {
  width: 100%;
  aspect-ratio: 1;
  max-width: 320px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-container-md);
  padding: 12px;
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.preview__svg :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}
.preview__empty {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
}
.preview__actions {
  display: flex;
  gap: var(--sp-2);
}
.err {
  font-size: var(--fs-xs);
  color: var(--c-danger);
  text-align: center;
}
</style>
