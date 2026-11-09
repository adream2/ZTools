<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  buildQuery,
  decodeComponent,
  decodeFullUrl,
  encodeComponent,
  encodeFullUrl,
  encodeQueryPairs,
  parseQuery,
  type QueryPair,
} from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const mode = ref('component')
const tabs = [
  { id: 'component', label: '组件编码' },
  { id: 'full', label: '整条 URL' },
  { id: 'query', label: '查询参数' },
]

const input = ref('')
const output = ref('')
const error = ref('')

const pairs = ref<QueryPair[]>([])

const queryString = computed(() => buildQuery(pairs.value))

function run(dir: 'encode' | 'decode'): void {
  error.value = ''
  try {
    if (mode.value === 'component') {
      output.value = dir === 'encode' ? encodeComponent(input.value) : decodeComponent(input.value)
    } else {
      output.value = dir === 'encode' ? encodeFullUrl(input.value) : decodeFullUrl(input.value)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

function parse(): void {
  error.value = ''
  try {
    pairs.value = parseQuery(input.value)
    if (!pairs.value.length) error.value = '没有解析到查询参数'
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

function encodePairs(): void {
  pairs.value = encodeQueryPairs(pairs.value)
}

function addPair(): void {
  pairs.value = [...pairs.value, { key: '', value: '' }]
}

function removePair(i: number): void {
  pairs.value = pairs.value.filter((_, idx) => idx !== i)
}

function toInput(): void {
  if (!output.value) return
  input.value = output.value
  output.value = ''
}
</script>

<template>
  <div class="uc">
    <BaseTabs v-model="mode" :tabs="tabs" @update:model-value="output = ''" />

    <template v-if="mode !== 'query'">
      <div class="bar">
        <BaseButton variant="primary" size="sm" @click="run('encode')">{{ mode === 'component' ? '编码' : '规范化' }}</BaseButton>
        <BaseButton size="sm" @click="run('decode')">{{ mode === 'component' ? '解码' : '还原' }}</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="toInput">结果转输入</BaseButton>
        <span class="bar__gap" />
        <BaseButton size="sm" variant="ghost" @click="input = ''; output = ''">清空</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="split">
        <Field label="输入">
          <BaseTextarea v-model="input" :rows="10" placeholder="要编码或解码的内容…" />
        </Field>
        <Field label="输出">
          <div class="out">
            <div class="out__bar"><span class="u-xs u-dim">{{ output.length }} 字符</span><CopyButton :text="output" /></div>
            <BaseTextarea v-model="output" :rows="10" readonly placeholder="尚无输出" class="out__ta" />
          </div>
        </Field>
      </div>

      <p class="tip">
        <template v-if="mode === 'component'">组件编码会把 <code>/</code> <code>?</code> <code>&amp;</code> <code>=</code> 也转义，适合作为单个参数值。</template>
        <template v-else>整条 URL 只转义空白、中文等非法字符，保留结构符号，适合修好一条被弄乱的链接。</template>
      </p>
    </template>

    <template v-else>
      <Field label="粘贴 URL 或查询串" hint="支持完整链接、?a=1&b=2、或纯 a=1&b=2">
        <BaseTextarea v-model="input" :rows="3" placeholder="https://example.com/search?q=hello&page=2" />
      </Field>
      <div class="bar">
        <BaseButton variant="primary" size="sm" :disabled="!input.trim()" @click="parse">解析</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="addPair">加一行</BaseButton>
        <BaseButton size="sm" variant="ghost" :disabled="!pairs.length" @click="encodePairs">编码所有值</BaseButton>
        <span class="bar__gap" />
        <CopyButton :text="queryString" label="复制查询串" />
      </div>

      <div v-if="pairs.length" class="pairs">
        <div v-for="(p, i) in pairs" :key="i" class="pair">
          <input v-model="p.key" class="pair__in pair__in--key" placeholder="key" spellcheck="false" />
          <input v-model="p.value" class="pair__in" placeholder="value" spellcheck="false" />
          <button type="button" class="pair__del" aria-label="删除" @click="removePair(i)">×</button>
        </div>
      </div>
      <div v-else class="u-sm u-dim">解析后在这里逐行编辑，结果实时同步。</div>

      <Field v-if="pairs.length" label="结果">
        <BaseTextarea :model-value="queryString" :rows="3" readonly />
      </Field>
    </template>
  </div>
</template>

<style scoped>
.uc {
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
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 10px;
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.out__ta {
  border: none;
  border-radius: 0;
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
.pairs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pair {
  display: flex;
  gap: 4px;
}
.pair__in {
  flex: 2;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}
.pair__in--key {
  flex: 1;
  color: var(--c-accent);
}
.pair__in:focus {
  outline: none;
  border-color: var(--c-accent);
  box-shadow: var(--ring);
}
.pair__del {
  width: 30px;
  color: var(--c-text-3);
  border-radius: var(--radius-sm);
}
.pair__del:hover {
  color: var(--c-danger);
  background: var(--c-danger-weak);
}
</style>
