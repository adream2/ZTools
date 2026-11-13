<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import JsBarcode from 'jsbarcode'
import { FORMATS, download, svgToPng, validate, type BarcodeFormat } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import Field from '@/components/ui/Field.vue'
import { toastError } from '@/core/toast'

const text = ref('ZT-2026-001')
const format = ref<BarcodeFormat>('CODE128')
const width = ref('2')
const height = ref('90')
const showText = ref(true)
const margin = ref('10')

const svgRef = ref<SVGSVGElement | null>(null)
const error = ref('')

const formatOptions = FORMATS.map((f) => ({ label: f.label, value: f.id }))
const current = FORMATS.find((f) => f.id === format.value)

function render(): void {
  error.value = ''
  const el = svgRef.value
  if (!el) return
  try {
    const value = validate(text.value, format.value)
    JsBarcode(el, value, {
      format: format.value,
      width: Math.max(1, Number(width.value) || 2),
      height: Math.max(30, Number(height.value) || 90),
      displayValue: showText.value,
      fontSize: 18,
      margin: Math.max(0, Number(margin.value) || 10),
      background: '#ffffff',
      lineColor: '#000000',
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    el.innerHTML = ''
  }
}

watch([text, format, width, height, showText, margin], render)
onMounted(render)

function saveSvg(): void {
  if (!svgRef.value || error.value) return
  const data = new XMLSerializer().serializeToString(svgRef.value)
  download(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`, 'barcode.svg', 'image/svg+xml')
}

async function savePng(): Promise<void> {
  if (!svgRef.value || error.value) return
  try {
    const blob = await svgToPng(svgRef.value, 3)
    download(blob, 'barcode.png', 'image/png')
  } catch (e) {
    toastError(e instanceof Error ? e.message : String(e))
  }
}

const SAMPLE: Record<string, string> = {
  CODE128: 'ZT-2026-001',
  CODE39: 'ZT 2026',
  EAN13: '690123456789',
  EAN8: '1234567',
  UPC: '12345678901',
  ITF14: '1234567890123',
  MSI: '1234567',
  Pharmacode: '1234',
}

function switchFormat(id: string | number): void {
  format.value = id as BarcodeFormat
  text.value = SAMPLE[format.value] ?? text.value
}
</script>

<template>
  <div class="bc">
    <div class="bar">
      <div class="bar__grow">
        <Field label="内容" :hint="current?.hint">
          <BaseInput v-model="text" mono placeholder="要编码的文本或数字" />
        </Field>
      </div>
      <div class="bar__f">
        <Field label="格式">
          <BaseSelect :model-value="format" :options="formatOptions" @update:model-value="switchFormat" />
        </Field>
      </div>
      <div class="bar__n">
        <Field label="条宽">
          <BaseInput v-model="width" type="number" mono />
        </Field>
      </div>
      <div class="bar__n">
        <Field label="高">
          <BaseInput v-model="height" type="number" mono />
        </Field>
      </div>
      <label class="chk"><BaseSwitch v-model="showText" /><span>显示文字</span></label>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div class="preview clay-inset">
      <svg ref="svgRef" class="preview__svg" />
    </div>

    <div class="foot">
      <BaseButton variant="primary" size="sm" :disabled="!!error" @click="savePng">下载 PNG</BaseButton>
      <BaseButton size="sm" :disabled="!!error" @click="saveSvg">下载 SVG</BaseButton>
      <span class="u-xs u-dim">PNG 按 3 倍分辨率导出，可直接用于打印标签</span>
    </div>

    <p class="tip">
      Code 128 适合内部编号；EAN-13 / UPC 用于零售商品，需要合法的厂商前缀；ITF-14 用于物流外箱。
    </p>
  </div>
</template>

<style scoped>
.bc {
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
.bar__grow {
  flex: 1;
  min-width: 220px;
}
.bar__f {
  width: 200px;
}
.bar__n {
  width: 82px;
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
.preview {
  display: grid;
  place-items: center;
  padding: var(--sp-4);
  min-height: 200px;
  border-radius: var(--radius-container-md);
  overflow: auto;
}
.preview__svg {
  max-width: 100%;
  height: auto;
}
.foot {
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
</style>
