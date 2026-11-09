<script setup lang="ts">
import { computed, ref } from 'vue'
import { decodeJwt, describeClaims, statusOf } from './logic'
import { highlightJson } from '@/core/json-highlight'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const token = ref('')

const parsed = computed<{ data: ReturnType<typeof decodeJwt> | null; error: string }>(() => {
  if (!token.value.trim()) return { data: null, error: '' }
  try {
    return { data: decodeJwt(token.value), error: '' }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const decoded = computed(() => parsed.value.data)
const error = computed(() => parsed.value.error)

const status = computed(() => (decoded.value ? statusOf(decoded.value.payload) : null))
const claims = computed(() => (decoded.value ? describeClaims(decoded.value.payload) : []))

const headerHtml = computed(() => (decoded.value ? highlightJson(JSON.stringify(decoded.value.header, null, 2)) : ''))
const payloadHtml = computed(() => (decoded.value ? highlightJson(JSON.stringify(decoded.value.payload, null, 2)) : ''))

const headerText = computed(() => (decoded.value ? JSON.stringify(decoded.value.header, null, 2) : ''))
const payloadText = computed(() => (decoded.value ? JSON.stringify(decoded.value.payload, null, 2) : ''))

function clear(): void {
  token.value = ''
}

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuW8oOS4iSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
</script>

<template>
  <div class="jwt">
    <Field label="JWT" hint="支持带 Bearer 前缀，粘贴即解析">
      <BaseTextarea v-model="token" :rows="4" placeholder="eyJhbGciOiJIUzI1NiIs…" :invalid="!!error" />
    </Field>

    <div class="bar">
      <BaseButton size="sm" variant="ghost" @click="token = SAMPLE">示例</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clear">清空</BaseButton>
      <span class="bar__gap" />
      <span class="u-xs u-dim">仅解码，不验证签名</span>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <template v-if="decoded">
      <div v-if="status" :class="['status', `status--${status.status}`]">
        {{ status.text }}
      </div>

      <div class="split">
        <div class="block">
          <div class="block__head">
            <span>Header</span>
            <CopyButton :text="headerText" label="" variant="ghost" />
          </div>
          <pre class="block__code" v-html="headerHtml" />
        </div>
        <div class="block">
          <div class="block__head">
            <span>Payload</span>
            <CopyButton :text="payloadText" label="" variant="ghost" />
          </div>
          <pre class="block__code" v-html="payloadHtml" />
        </div>
      </div>

      <div v-if="claims.length" class="claims">
        <table>
          <thead>
            <tr><th>声明</th><th>含义</th><th>值</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in claims" :key="c.key">
              <td><code>{{ c.key }}</code></td>
              <td class="u-dim">{{ c.meaning ?? '—' }}</td>
              <td class="claims__val">{{ c.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="decoded.signature" class="sig">
        <span class="u-xs u-dim">签名段（未验证）</span>
        <code>{{ decoded.signature.slice(0, 48) }}{{ decoded.signature.length > 48 ? '…' : '' }}</code>
      </div>
    </template>

    <p class="tip">
      解析完全在本地进行。<code>exp</code> / <code>nbf</code> 按 UTC 秒计算，与服务端一致；签名是否正确需要密钥，这里不做校验。
    </p>
  </div>
</template>

<style scoped>
.jwt {
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
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.status {
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  border: 1px solid transparent;
}
.status--valid {
  color: var(--c-ok);
  background: color-mix(in srgb, var(--c-ok) 10%, transparent);
  border-color: color-mix(in srgb, var(--c-ok) 30%, transparent);
}
.status--expired {
  color: var(--c-danger);
  background: var(--c-danger-weak);
  border-color: color-mix(in srgb, var(--c-danger) 30%, transparent);
}
.status--not-yet,
.status--unknown {
  color: var(--c-warn);
  background: var(--c-warn-weak);
  border-color: color-mix(in srgb, var(--c-warn) 30%, transparent);
}
.block {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  background: var(--c-code-bg);
  box-shadow: var(--clay-inset);
}
.block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 10px;
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
}
.block__code {
  margin: 0;
  padding: var(--sp-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-code);
  overflow: auto;
  max-height: 260px;
}
.block__code :deep(.j-key) {
  color: var(--c-accent);
}
.block__code :deep(.j-str) {
  color: var(--c-ok);
}
.block__code :deep(.j-num) {
  color: #a254f5;
}
.block__code :deep(.j-bool) {
  color: var(--c-warn);
}
.block__code :deep(.j-null) {
  color: var(--c-text-3);
}
.claims {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  font-size: var(--fs-sm);
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.claims th {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  font-weight: 500;
  background: var(--c-bg-subtle);
}
.claims th,
.claims td {
  text-align: left;
  padding: 6px 10px;
  border-bottom: 1px solid var(--c-border);
  vertical-align: top;
}
.claims tr:last-child td {
  border-bottom: none;
}
.claims__val {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  word-break: break-all;
}
.sig {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sig code {
  font-size: var(--fs-xs);
  color: var(--c-text-2);
  word-break: break-all;
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
