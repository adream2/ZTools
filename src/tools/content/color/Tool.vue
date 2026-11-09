<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  formatHsl,
  formatRgb,
  hexToRgb,
  hslToRgb,
  judge,
  normalizeHex,
  readableText,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  shades,
} from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const hex = ref('#2f6bff')
const error = ref('')

const safeHex = computed(() => {
  try {
    error.value = ''
    return normalizeHex(hex.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    return '#000000'
  }
})

const rgb = computed(() => hexToRgb(safeHex.value))
const hsl = computed(() => rgbToHsl(rgb.value))
const hsv = computed(() => rgbToHsv(rgb.value))
const text = computed(() => readableText(safeHex.value))
const swatches = computed(() => shades(safeHex.value, 11))

const fg = ref('#ffffff')
const bg = ref('#2f6bff')
const contrast = computed(() => {
  try {
    return judge(hexToRgb(fg.value), hexToRgb(bg.value))
  } catch {
    return null
  }
})

const values = computed(() => [
  { label: 'HEX', value: safeHex.value },
  { label: 'RGB', value: formatRgb(rgb.value) },
  { label: 'HSL', value: formatHsl(hsl.value) },
  { label: 'HSV', value: `hsv(${hsv.value.h}, ${hsv.value.s}%, ${hsv.value.v}%)` },
  { label: 'CSS 变量', value: `--color-brand: ${safeHex.value};` },
])

function onPick(e: Event): void {
  hex.value = (e.target as HTMLInputElement).value
}

function setHsl(key: 'h' | 's' | 'l', value: string): void {
  const n = Number(value)
  if (Number.isNaN(n)) return
  const next = { ...hsl.value }
  next[key] = n
  hex.value = rgbToHex(hslToRgb(next))
}
</script>

<template>
  <div class="color">
    <div class="hero" :style="{ background: safeHex, color: text }">
      <div class="hero__hex">{{ safeHex }}</div>
      <div class="hero__sub">{{ formatRgb(rgb) }} · {{ formatHsl(hsl) }}</div>
    </div>

    <div class="bar">
      <Field label="取色">
        <input type="color" :value="safeHex" class="picker" @input="onPick" />
      </Field>
      <div class="bar__hex">
        <Field label="HEX" :hint="error">
          <BaseInput v-model="hex" mono :invalid="!!error" />
        </Field>
      </div>
      <div class="bar__sliders">
        <label class="slider">
          <span>H {{ hsl.h }}</span>
          <input type="range" min="0" max="360" :value="hsl.h" @input="setHsl('h', ($event.target as HTMLInputElement).value)" />
        </label>
        <label class="slider">
          <span>S {{ hsl.s }}%</span>
          <input type="range" min="0" max="100" :value="hsl.s" @input="setHsl('s', ($event.target as HTMLInputElement).value)" />
        </label>
        <label class="slider">
          <span>L {{ hsl.l }}%</span>
          <input type="range" min="0" max="100" :value="hsl.l" @input="setHsl('l', ($event.target as HTMLInputElement).value)" />
        </label>
      </div>
    </div>

    <div class="values">
      <div v-for="v in values" :key="v.label" class="value">
        <span class="value__k">{{ v.label }}</span>
        <code class="value__v">{{ v.value }}</code>
        <CopyButton :text="v.value" label="" variant="ghost" />
      </div>
    </div>

    <div class="block">
      <div class="block__title">明暗梯度</div>
      <div class="swatches">
        <button
          v-for="s in swatches"
          :key="s"
          type="button"
          class="swatch"
          :style="{ background: s, color: readableText(s) }"
          :title="s"
          @click="hex = s"
        >
          {{ s.slice(1) }}
        </button>
      </div>
    </div>

    <div class="block">
      <div class="block__title">对比度检测（WCAG）</div>
      <div class="contrast">
        <div class="contrast__preview" :style="{ background: bg, color: fg }">
          <span class="contrast__big">大字号 18pt</span>
          <span class="contrast__normal">正文示例文字，用于检查可读性。</span>
        </div>
        <div class="contrast__ctrl">
          <div class="contrast__pickers">
            <Field label="前景"><input v-model="fg" type="color" class="picker picker--sm" /></Field>
            <Field label="背景"><input v-model="bg" type="color" class="picker picker--sm" /></Field>
          </div>
          <div v-if="contrast" class="verdict">
            <div class="verdict__ratio">{{ contrast.ratio }} : 1</div>
            <div :class="['verdict__grade', contrast.aaaNormal ? 'is-aaa' : contrast.aaNormal ? 'is-aa' : 'is-fail']">{{ contrast.grade }}</div>
            <ul class="verdict__list">
              <li :class="{ ok: contrast.aaNormal }">正文 AA（≥4.5）</li>
              <li :class="{ ok: contrast.aaaLarge }">大字号 AAA（≥4.5）</li>
              <li :class="{ ok: contrast.aaaNormal }">正文 AAA（≥7）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.hero {
  padding: var(--sp-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border);
}
.hero__hex {
  font-family: var(--font-mono);
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.hero__sub {
  font-size: var(--fs-sm);
  opacity: 0.75;
  font-family: var(--font-mono);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.picker {
  width: 56px;
  height: 34px;
  padding: 2px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  cursor: pointer;
}
.picker--sm {
  width: 100%;
  height: 30px;
}
.bar__hex {
  width: 150px;
}
.bar__sliders {
  flex: 1;
  min-width: 240px;
  display: flex;
  gap: var(--sp-3);
}
.slider {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.slider input {
  width: 100%;
  accent-color: var(--c-accent);
}
.values {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.value {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 6px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
}
.value:last-child {
  border-bottom: none;
}
.value__k {
  width: 76px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.value__v {
  flex: 1;
  font-size: var(--fs-sm);
  user-select: all;
}
.block__title {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  margin-bottom: var(--sp-2);
}
.swatches {
  display: flex;
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.swatch {
  flex: 1;
  height: 46px;
  font-family: var(--font-mono);
  font-size: 10px;
  text-align: center;
  transition: transform var(--dur-fast) var(--ease);
}
.swatch:hover {
  transform: scaleY(1.12);
}
.contrast {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--sp-3);
}
.contrast__preview {
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border);
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}
.contrast__big {
  font-size: 24px;
  font-weight: 600;
}
.contrast__normal {
  font-size: var(--fs-md);
}
.contrast__ctrl {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.contrast__pickers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-2);
}
.verdict {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.verdict__ratio {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 600;
}
.verdict__grade {
  align-self: flex-start;
  font-size: var(--fs-xs);
  padding: 1px 7px;
  border-radius: var(--radius-full);
}
.verdict__grade.is-aaa {
  color: var(--c-ok);
  background: color-mix(in srgb, var(--c-ok) 12%, transparent);
}
.verdict__grade.is-aa {
  color: var(--c-accent);
  background: var(--c-accent-weak);
}
.verdict__grade.is-fail {
  color: var(--c-danger);
  background: var(--c-danger-weak);
}
.verdict__list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.verdict__list li::before {
  content: '✗ ';
}
.verdict__list li.ok {
  color: var(--c-ok);
}
.verdict__list li.ok::before {
  content: '✓ ';
}
@media (max-width: 720px) {
  .contrast {
    grid-template-columns: 1fr;
  }
  .bar {
    flex-direction: column;
    align-items: stretch;
  }
  .bar__hex {
    width: 100%;
  }
  .bar__sliders {
    flex-direction: column;
    min-width: 0;
  }
}
</style>
