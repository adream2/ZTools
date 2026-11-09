<script setup lang="ts">
import { ref } from 'vue'
import { RECORD_TYPES, queryDns, sortAnswers, validateDomain, type DnsAnswer, type DnsResult, type RecordType } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const domain = ref('')
const type = ref<RecordType>('A')
const result = ref<DnsResult | null>(null)
const error = ref('')
const loading = ref(false)

async function search(): Promise<void> {
  error.value = ''
  loading.value = true
  try {
    const name = validateDomain(domain.value)
    result.value = await queryDns(name, type.value)
    result.value.answers = sortAnswers(result.value.answers)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    result.value = null
  } finally {
    loading.value = false
  }
}

function pick(t: RecordType): void {
  type.value = t
  if (domain.value.trim()) void search()
}

const textOf = (answers: DnsAnswer[]) => answers.map((a) => `${a.name}\t${a.ttl}\t${a.type}\t${a.data}`).join('\n')
</script>

<template>
  <div class="dns">
    <div class="bar">
      <div class="bar__grow">
        <Field label="域名" hint="可粘贴完整网址，会自动去掉协议与路径">
          <BaseInput v-model="domain" mono placeholder="example.com" @keydown.enter="search" />
        </Field>
      </div>
      <BaseButton variant="primary" :loading="loading" @click="search">查询</BaseButton>
    </div>

    <div class="types">
      <button
        v-for="t in RECORD_TYPES"
        :key="t"
        type="button"
        :class="['type', { 'is-on': type === t }]"
        @click="pick(t)"
      >
        {{ t }}
      </button>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <template v-if="result">
      <div class="meta">
        <span :class="['status', result.status.startsWith('NOERROR') ? 'is-ok' : 'is-bad']">{{ result.status }}</span>
        <span class="u-xs u-dim">{{ result.answers.length }} 条记录 · {{ result.elapsed }} ms · {{ result.source }}</span>
        <span class="u-grow" />
        <CopyButton :text="textOf(result.answers)" label="复制为文本" />
      </div>

      <div v-if="result.answers.length" class="table">
        <div class="tr tr--head">
          <span>类型</span>
          <span>TTL</span>
          <span>值</span>
        </div>
        <div v-for="(a, i) in result.answers" :key="i" class="tr">
          <span class="tr__type">{{ a.type }}</span>
          <span class="tr__ttl">{{ a.ttl }}s</span>
          <code class="tr__data">{{ a.data }}</code>
        </div>
      </div>
      <div v-else class="empty">该类型没有返回记录。有些域名只配置了必要记录，换 A / AAAA / CNAME 试试。</div>
    </template>

    <p class="tip">
      通过 DNS over HTTPS 直接查询 Cloudflare / Google / 阿里公共解析，三源任一可用即返回；请求失败时会依次尝试下一个。
    </p>
  </div>
</template>

<style scoped>
.dns {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
}
.bar__grow {
  flex: 1;
}
.types {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.type {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--c-text-2);
}
.type:hover {
  border-color: var(--c-border-strong);
}
.type.is-on {
  background: var(--c-accent-weak);
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  white-space: pre-wrap;
}
.meta {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.status {
  font-size: var(--fs-xs);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
.status.is-ok {
  color: var(--c-ok);
  background: color-mix(in srgb, var(--c-ok) 12%, transparent);
}
.status.is-bad {
  color: var(--c-danger);
  background: var(--c-danger-weak);
}
.table {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.tr {
  display: grid;
  grid-template-columns: 70px 70px minmax(0, 1fr);
  gap: var(--sp-2);
  padding: 7px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-sm);
  align-items: baseline;
}
.tr:last-child {
  border-bottom: none;
}
.tr--head {
  background: var(--c-bg-subtle);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.tr__type {
  font-family: var(--font-mono);
  color: var(--c-accent);
  font-size: var(--fs-xs);
}
.tr__ttl {
  font-family: var(--font-mono);
  color: var(--c-text-3);
  font-size: var(--fs-xs);
}
.tr__data {
  font-size: var(--fs-sm);
  word-break: break-all;
}
.empty {
  padding: var(--sp-4);
  border: 1px dashed var(--c-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  color: var(--c-text-3);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
