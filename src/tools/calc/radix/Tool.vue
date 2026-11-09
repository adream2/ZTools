<script setup lang="ts">
import { computed, ref } from 'vue'
import { BASES, asciiHint, byteLength, convertAll, parseInBase } from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const fromBase = ref('10')
const raw = ref('1024')

const tabs = BASES.map((b) => ({ id: String(b.value), label: `${b.label} ${b.value}` }))

const parsed = computed(() => {
  try {
    return { results: convertAll(raw.value, Number(fromBase.value)), value: parseInBase(raw.value, Number(fromBase.value)), error: '' }
  } catch (e) {
    return { results: [], value: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const digits = computed(() => raw.value.replace(/\s/g, '').length)
</script>

<template>
  <div class="radix">
    <div class="bar">
      <BaseTabs v-model="fromBase" :tabs="tabs" />
      <span class="u-xs u-dim">{{ digits }} 位</span>
      <span class="bar__gap" />
      <BaseInput v-model="raw" mono class="bar__in" placeholder="输入数字" />
    </div>

    <p v-if="parsed.error" class="err">{{ parsed.error }}</p>

    <div v-if="parsed.results.length" class="list">
      <div v-for="r in parsed.results" :key="r.base" class="row">
        <span class="row__label">{{ r.label }}</span>
        <code class="row__value">{{ r.grouped }}</code>
        <CopyButton :text="r.value" label="" variant="ghost" />
      </div>
    </div>

    <div v-if="parsed.value !== null" class="meta">
      <span>字节数 <b>{{ byteLength(parsed.value) }}</b></span>
      <span v-if="asciiHint(parsed.value)">对应字符 <b class="ascii">{{ asciiHint(parsed.value) }}</b></span>
      <span>位数 <b>{{ parsed.value.toString(2).replace('-', '').length }} bit</b></span>
    </div>

    <p class="tip">
      内部使用 BigInt 计算，不受 2^53 精度限制，可以直接换算很长的十六进制串。输入会自动忽略空格、下划线和非法字符。
    </p>
  </div>
</template>

<style scoped>
.radix {
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
.bar__gap {
  flex: 1;
}
.bar__in {
  width: 100%;
  max-width: 380px;
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
  padding: 8px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
}
.row:last-child {
  border-bottom: none;
}
.row:hover {
  background: var(--c-bg-subtle);
}
.row__label {
  width: 100px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.row__value {
  flex: 1;
  font-size: var(--fs-md);
  font-family: var(--font-mono);
  word-break: break-all;
  user-select: all;
}
.meta {
  display: flex;
  gap: var(--sp-4);
  flex-wrap: wrap;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.meta b {
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-weight: 500;
}
.ascii {
  font-size: var(--fs-md);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
