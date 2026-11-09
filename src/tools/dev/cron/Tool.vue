<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { PRESETS, analyze, fieldCount, formatRun, type CronInfo } from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'

const expr = ref('*/5 * * * *')
const info = ref<CronInfo | null>(null)
const busy = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
let runId = 0

async function execute(): Promise<void> {
  const id = ++runId
  busy.value = true
  const out = await analyze(expr.value)
  if (id !== runId) return
  info.value = out
  busy.value = false
}

watch(expr, () => {
  clearTimeout(timer)
  timer = setTimeout(() => void execute(), 300)
})

onMounted(() => void execute())

const fields = computed(() => {
  const parts = expr.value.trim().split(/\s+/)
  const labels = parts.length >= 6 ? ['秒', '分', '时', '日', '月', '周'] : ['分', '时', '日', '月', '周']
  return labels.map((label, i) => ({ label, value: parts[i] ?? '' }))
})

const runs = computed(() => (info.value?.runs ?? []).map(formatRun))
</script>

<template>
  <div class="cron">
    <div class="input">
      <BaseInput v-model="expr" mono class="input__field" placeholder="* * * * *" />
      <span class="input__hint">{{ fieldCount(expr) }} 段</span>
    </div>

    <div class="presets">
      <button v-for="p in PRESETS" :key="p.expr" type="button" class="preset" :class="{ 'is-on': expr.trim() === p.expr }" @click="expr = p.expr">
        {{ p.label }}
      </button>
    </div>

    <div class="fields">
      <div v-for="f in fields" :key="f.label" class="field">
        <span class="field__label">{{ f.label }}</span>
        <span class="field__value">{{ f.value }}</span>
      </div>
    </div>

    <div v-if="info?.error" class="err">{{ info.error }}</div>

    <div v-else-if="info" class="desc">
      <div class="desc__text">{{ info.description }}</div>
      <div class="desc__sub">按本地时区（{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}）计算</div>
    </div>

    <div v-if="runs.length" class="runs">
      <div class="runs__head">接下来 5 次触发</div>
      <div v-for="(r, i) in runs" :key="i" class="run">
        <span class="run__idx">{{ i + 1 }}</span>
        <span class="run__date u-mono">{{ r.date }}</span>
        <span class="run__time u-mono">{{ r.time }}</span>
        <span class="run__week">{{ r.weekday }}</span>
        <span class="run__rel">{{ r.relative }}</span>
      </div>
    </div>

    <p class="tip">
      支持标准 5 段（分 时 日 月 周）与带秒的 6 段。常用符号：<code>*</code> 任意、<code>/n</code> 步长、
      <code>a-b</code> 区间、<code>a,b</code> 枚举、<code>?</code> 不指定（部分实现）。
    </p>
  </div>
</template>

<style scoped>
.cron {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.input {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.input__field :deep(input) {
  font-size: var(--fs-lg);
  height: 42px;
}
.input__hint {
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.preset {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border);
  font-size: var(--fs-xs);
  color: var(--c-text-2);
}
.preset:hover {
  border-color: var(--c-border-strong);
  color: var(--c-text);
}
.preset.is-on {
  background: var(--c-accent-weak);
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.fields {
  display: flex;
  gap: 4px;
}
.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-code-bg);
}
.field__label {
  font-size: 10px;
  color: var(--c-text-3);
}
.field__value {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.desc {
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--c-accent-weak);
}
.desc__text {
  font-size: var(--fs-md);
  font-weight: 500;
}
.desc__sub {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  margin-top: 2px;
}
.runs {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.runs__head {
  padding: 6px 10px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.run {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 7px 10px;
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-sm);
}
.run:last-child {
  border-bottom: none;
}
.run__idx {
  width: 18px;
  color: var(--c-text-3);
  font-size: var(--fs-xs);
}
.run__time {
  color: var(--c-accent);
}
.run__week {
  color: var(--c-text-3);
  font-size: var(--fs-xs);
}
.run__rel {
  margin-left: auto;
  color: var(--c-text-3);
  font-size: var(--fs-xs);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.8;
}
.tip code {
  background: var(--c-bg-subtle);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
