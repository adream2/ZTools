<script setup lang="ts">
import { ref } from 'vue'
import { probe, tlsInfo, type ProbeResult } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const url = ref('')
const result = ref<ProbeResult | null>(null)
const error = ref('')
const loading = ref(false)

async function run(): Promise<void> {
  error.value = ''
  loading.value = true
  try {
    result.value = await probe(url.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    result.value = null
  } finally {
    loading.value = false
  }
}

const headersText = (r: ProbeResult) => r.headers.map((h) => `${h.key}: ${h.value}`).join('\n')
</script>

<template>
  <div class="hd">
    <div class="notice">
      浏览器不允许跨域读取响应头。目标站点没开 CORS 时，本工具只能确认「能否连上」和耗时，读不到状态码与 Header —— 这是安全策略，不是工具偷懒。
    </div>

    <div class="bar">
      <div class="bar__grow">
        <Field label="网址" hint="不带协议时默认按 https 探测">
          <BaseInput v-model="url" mono placeholder="example.com" @keydown.enter="run" />
        </Field>
      </div>
      <BaseButton variant="primary" :loading="loading" @click="run">检测</BaseButton>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <template v-if="result">
      <div class="grid">
        <div class="cell">
          <div class="cell__label">结果</div>
          <div :class="['cell__value', result.ok ? 'is-ok' : 'is-bad']">
            {{ result.ok ? '可访问' : '异常' }}
          </div>
        </div>
        <div class="cell">
          <div class="cell__label">状态码</div>
          <div class="cell__value u-mono">{{ result.status || '—' }}</div>
        </div>
        <div class="cell">
          <div class="cell__label">耗时</div>
          <div class="cell__value u-mono">{{ result.elapsed }} ms</div>
        </div>
        <div class="cell">
          <div class="cell__label">协议</div>
          <div class="cell__value cell__value--sm">{{ tlsInfo(result.finalUrl) }}</div>
        </div>
      </div>

      <div class="urls">
        <div class="urls__row"><span>输入</span><code>{{ result.input }}</code></div>
        <div class="urls__row"><span>最终</span><code>{{ result.finalUrl }}</code></div>
      </div>

      <div class="note">{{ result.note }}</div>

      <template v-if="result.headers.length">
        <div class="hd__head">
          <span>响应头</span>
          <CopyButton :text="headersText(result)" label="复制全部" />
        </div>
        <div class="table">
          <div v-for="h in result.headers" :key="h.key" class="tr">
            <code class="tr__k">{{ h.key }}</code>
            <code class="tr__v">{{ h.value }}</code>
          </div>
        </div>
      </template>
    </template>

    <p class="tip">
      单次探测只发一个 GET 请求，不跟随页面内资源，不会重复请求。想拿到完整响应头，需要服务端代理或在目标站点配置 <code>Access-Control-Expose-Headers</code>。
    </p>
  </div>
</template>

<style scoped>
.hd {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.notice {
  font-size: var(--fs-xs);
  line-height: 1.7;
  color: var(--c-warn);
  background: var(--c-warn-weak);
  border: 1px solid color-mix(in srgb, var(--c-warn) 25%, transparent);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
}
.bar__grow {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--sp-2);
}
.cell {
  padding: 10px var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg-subtle);
}
.cell__label {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  margin-bottom: 2px;
}
.cell__value {
  font-size: var(--fs-lg);
  font-weight: 600;
}
.cell__value--sm {
  font-size: var(--fs-sm);
  font-weight: 500;
}
.cell__value.is-ok {
  color: var(--c-ok);
}
.cell__value.is-bad {
  color: var(--c-danger);
}
.urls {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: var(--fs-xs);
}
.urls__row {
  display: flex;
  gap: var(--sp-2);
}
.urls__row span {
  width: 32px;
  flex: none;
  color: var(--c-text-3);
}
.urls__row code {
  word-break: break-all;
  color: var(--c-text-2);
}
.note {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  line-height: 1.6;
  padding: 8px 10px;
  border-left: 2px solid var(--c-border-strong);
  background: var(--c-bg-subtle);
}
.hd__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.table {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  max-height: 320px;
  overflow-y: auto;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.tr {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: var(--sp-2);
  padding: 5px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-xs);
}
.tr:last-child {
  border-bottom: none;
}
.tr__k {
  color: var(--c-accent);
  word-break: break-all;
}
.tr__v {
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
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tr {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
