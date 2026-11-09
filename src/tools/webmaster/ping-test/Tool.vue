<script setup lang="ts">
import { ref } from 'vue'
import { ping, type PingSummary } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import Field from '@/components/ui/Field.vue'

const url = ref('')
const count = ref('5')
const result = ref<PingSummary | null>(null)
const busy = ref(false)
const progress = ref(0)
const error = ref('')

const countOptions = [
  { label: '3 次', value: '3' },
  { label: '5 次', value: '5' },
  { label: '10 次', value: '10' },
]

async function run(): Promise<void> {
  busy.value = true
  error.value = ''
  progress.value = 0
  result.value = null
  try {
    result.value = await ping(url.value, Number(count.value), (done) => (progress.value = done))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

const grade = (ms: number) => (ms < 200 ? 'is-good' : ms < 600 ? 'is-mid' : 'is-bad')
</script>

<template>
  <div class="ping">
    <div class="notice">
      浏览器只能发 <code>no-cors</code> 请求：能测出「连得上 + 往返耗时」，但读不到 HTTP 状态码，且第一次请求可能包含 DNS 与 TLS 握手，数值偏大属于正常。
    </div>

    <div class="bar">
      <div class="bar__grow">
        <Field label="网址" hint="不带协议时默认 https">
          <BaseInput v-model="url" mono placeholder="example.com" @keydown.enter="run" />
        </Field>
      </div>
      <div class="bar__f">
        <Field label="次数">
          <BaseSelect v-model="count" :options="countOptions" />
        </Field>
      </div>
      <BaseButton variant="primary" :loading="busy" @click="run">开始测试</BaseButton>
    </div>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-else-if="busy" class="u-sm u-dim">测试中 {{ progress }} / {{ count }}…</p>

    <template v-if="result">
      <div class="stats">
        <div class="stat">
          <span class="stat__k">平均</span>
          <span :class="['stat__v', grade(result.avg)]">{{ result.avg }} ms</span>
        </div>
        <div class="stat">
          <span class="stat__k">最小 / 最大</span>
          <span class="stat__v">{{ result.min }} / {{ result.max }} ms</span>
        </div>
        <div class="stat">
          <span class="stat__k">抖动</span>
          <span class="stat__v">{{ result.jitter }} ms</span>
        </div>
        <div class="stat">
          <span class="stat__k">成功率</span>
          <span class="stat__v">{{ result.success }} / {{ result.total }}</span>
        </div>
      </div>

      <div class="samples clay-list">
        <div v-for="s in result.samples" :key="s.index" class="sample">
          <span class="sample__idx">#{{ s.index }}</span>
          <span :class="['sample__dot', s.ok ? 'is-ok' : 'is-bad']" />
          <span class="sample__ms">{{ s.ok ? `${s.ms} ms` : s.error }}</span>
          <span class="sample__bar">
            <span
              :style="{ width: `${Math.min(100, (s.ms / Math.max(result.max, 1)) * 100)}%` }"
              :class="s.ok ? 'is-ok' : 'is-bad'"
            />
          </span>
        </div>
      </div>
    </template>

    <p class="tip">
      测的是「浏览器 → 目标站点」的往返时间，与你本地网络、CDN 节点、目标站点是否允许跨域都有关；数值仅供参考，不能替代服务端 ping。
    </p>
  </div>
</template>

<style scoped>
.ping {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.notice {
  font-size: var(--fs-xs);
  line-height: 1.7;
  color: var(--c-warn);
  background: var(--c-warn-weak);
  border-radius: var(--radius-control-sm);
  padding: 9px 12px;
}
.notice code {
  background: rgb(0 0 0 / 6%);
  padding: 1px 4px;
  border-radius: 3px;
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
  width: 100px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--sp-2);
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 11px 14px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
}
.stat__k {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.stat__v {
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: 600;
}
.stat__v.is-good {
  color: var(--c-ok);
}
.stat__v.is-mid {
  color: var(--c-warn);
}
.stat__v.is-bad {
  color: var(--c-danger);
}
.samples {
  overflow: hidden;
}
.sample {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 7px 14px;
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-sm);
}
.sample:last-child {
  border-bottom: none;
}
.sample__idx {
  width: 26px;
  color: var(--c-text-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
.sample__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
}
.sample__dot.is-ok {
  background: var(--c-ok);
}
.sample__dot.is-bad {
  background: var(--c-danger);
}
.sample__ms {
  width: 80px;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
.sample__bar {
  flex: 1;
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--c-bg-subtle);
  overflow: hidden;
}
.sample__bar span {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
}
.sample__bar .is-ok {
  background: var(--c-accent);
}
.sample__bar .is-bad {
  background: var(--c-danger);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
