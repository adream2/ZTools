<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DEFAULT_OPTIONS, entropyBits, generate, passphrase, poolSizeOf, strengthOf, type PasswordOptions } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const options = ref<PasswordOptions>({ ...DEFAULT_OPTIONS })
const password = ref('')
const error = ref('')

const pool = computed(() => poolSizeOf(options.value))
const bits = computed(() => entropyBits(password.value, pool.value))
const strength = computed(() => strengthOf(bits.value))

function refresh(): void {
  error.value = ''
  try {
    password.value = generate(options.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    password.value = ''
  }
}

watch(options, refresh, { deep: true })
refresh()

function makePassphrase(): void {
  password.value = passphrase(4, '-')
  error.value = ''
}

const lengthLabel = computed(() => `${options.value.length} 位`)
</script>

<template>
  <div class="pw">
    <div class="result">
      <code class="result__text">{{ password || '—' }}</code>
      <div class="result__actions">
        <BaseButton size="sm" variant="ghost" @click="refresh">换一个</BaseButton>
        <CopyButton :text="password" label="复制" size="md" />
      </div>
    </div>

    <div class="meter">
      <div class="meter__bars">
        <span v-for="i in 4" :key="i" :class="['meter__bar', { 'is-on': i <= strength.level }]" />
      </div>
      <div class="meter__meta">
        <span :class="['meter__label', `meter__label--${strength.level}`]">{{ strength.label }}</span>
        <span class="u-xs u-dim">约 {{ strength.bits }} bit 熵 · 字符池 {{ pool }} · {{ strength.hint }}</span>
      </div>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div class="opts">
      <Field :label="`长度 ${lengthLabel}`">
        <input v-model.number="options.length" type="range" min="4" max="64" class="range" />
      </Field>
    </div>

    <div class="switches">
      <label class="sw"><BaseSwitch v-model="options.upper" /><span>大写 A-Z</span></label>
      <label class="sw"><BaseSwitch v-model="options.lower" /><span>小写 a-z</span></label>
      <label class="sw"><BaseSwitch v-model="options.digits" /><span>数字 0-9</span></label>
      <label class="sw"><BaseSwitch v-model="options.symbols" /><span>符号 !@#$</span></label>
      <label class="sw"><BaseSwitch v-model="options.excludeAmbiguous" /><span>排除易混淆 0O1lI</span></label>
      <label class="sw"><BaseSwitch v-model="options.requireEach" /><span>每类至少一个</span></label>
    </div>

    <div class="u-row">
      <BaseButton size="sm" @click="makePassphrase">生成易记口令</BaseButton>
      <span class="u-xs u-dim">口令由 4 个常见英文单词拼成，更适合手输</span>
    </div>

    <p class="tip">
      使用 <code>crypto.getRandomValues</code> 加拒绝采样，不用 <code>Math.random</code>；生成过程完全在本机，密码不会离开浏览器。
    </p>
  </div>
</template>

<style scoped>
.pw {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.result {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: var(--c-bg-subtle);
}
.result__text {
  flex: 1;
  font-size: 20px;
  font-family: var(--font-mono);
  word-break: break-all;
  user-select: all;
  letter-spacing: 0.02em;
}
.result__actions {
  display: flex;
  gap: var(--sp-2);
  flex: none;
}
.meter {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.meter__bars {
  display: flex;
  gap: 3px;
}
.meter__bar {
  flex: 1;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--c-bg-sunken);
}
.meter__bar.is-on:nth-child(1) {
  background: var(--c-danger);
}
.meter__bar.is-on:nth-child(2) {
  background: var(--c-warn);
}
.meter__bar.is-on:nth-child(3) {
  background: #7a9cff;
}
.meter__bar.is-on:nth-child(4) {
  background: var(--c-ok);
}
.meter__meta {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.meter__label {
  font-size: var(--fs-sm);
  font-weight: 600;
}
.meter__label--1 {
  color: var(--c-danger);
}
.meter__label--2 {
  color: var(--c-warn);
}
.meter__label--3 {
  color: var(--c-accent);
}
.meter__label--4 {
  color: var(--c-ok);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.range {
  width: 100%;
  accent-color: var(--c-accent);
}
.switches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: var(--sp-2);
}
.sw {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
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
