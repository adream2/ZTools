<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ZONES, currentInfo, formatInZone, formatIso, formatLocal, relative, toDate, toTimestamp } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const raw = ref(String(Math.floor(Date.now() / 1000)))
const unit = ref<'auto' | 's' | 'ms'>('auto')
const now = ref(currentInfo())

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => (now.value = currentInfo()), 1000)
})
onBeforeUnmount(() => clearInterval(timer))

const parsed = computed<{ date: Date | null; error: string }>(() => {
  try {
    return { date: toDate(raw.value, unit.value === 'auto' ? undefined : unit.value), error: '' }
  } catch (e) {
    return { date: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const rows = computed(() => {
  const d = parsed.value.date
  if (!d) return []
  return [
    { label: 'Unix 秒', value: String(toTimestamp(d, 's')) },
    { label: 'Unix 毫秒', value: String(toTimestamp(d, 'ms')) },
    { label: 'ISO 8601', value: formatIso(d) },
    { label: '本地时间', value: formatLocal(d) },
    { label: '相对现在', value: relative(d) },
  ]
})

const unitOptions = [
  { label: '自动识别', value: 'auto' },
  { label: '秒', value: 's' },
  { label: '毫秒', value: 'ms' },
]

function useNow(): void {
  raw.value = String(Math.floor(Date.now() / 1000))
  unit.value = 's'
}

function fromLocalInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value
  if (!value) return
  raw.value = value.replace('T', ' ')
  unit.value = 'auto'
}
</script>

<template>
  <div class="ts">
    <div class="now">
      <div class="now__label">当前时间</div>
      <div class="now__s">{{ now.s }}</div>
      <div class="now__meta">
        <span>{{ now.local }}</span>
        <span class="u-dim">·</span>
        <span class="u-dim">{{ now.iso }}</span>
      </div>
    </div>

    <div class="bar">
      <div class="bar__grow">
        <Field label="时间戳或日期" hint="数字按时间戳解析，其他按日期解析">
          <BaseInput v-model="raw" mono placeholder="1700000000 或 2024-05-01 12:00:00" />
        </Field>
      </div>
      <div class="bar__unit">
        <Field label="单位">
          <BaseSelect v-model="unit" :options="unitOptions" />
        </Field>
      </div>
      <BaseButton size="md" @click="useNow">当前</BaseButton>
      <label class="bar__file">
        选日期
        <input type="datetime-local" step="1" @change="fromLocalInput" />
      </label>
    </div>

    <p v-if="parsed.error" class="err">{{ parsed.error }}</p>

    <div v-if="rows.length" class="rows">
      <div v-for="r in rows" :key="r.label" class="row">
        <span class="row__label">{{ r.label }}</span>
        <code class="row__value">{{ r.value }}</code>
        <CopyButton :text="r.value" label="" variant="ghost" />
      </div>
    </div>

    <div v-if="parsed.date" class="zones">
      <div class="zones__title">同一时刻在不同时区</div>
      <div v-for="z in ZONES" :key="z.tz || 'local'" class="zone">
        <span class="zone__name">{{ z.label }}</span>
        <span class="zone__time u-mono">{{ z.tz ? formatInZone(parsed.date, z.tz) : formatLocal(parsed.date) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ts {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.now {
  padding: var(--sp-4);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: var(--c-bg-subtle);
}
.now__label {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.now__s {
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}
.now__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: var(--fs-xs);
  color: var(--c-text-2);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__grow {
  flex: 1;
  min-width: 220px;
}
.bar__unit {
  width: 108px;
}
.bar__file {
  position: relative;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  border-radius: var(--radius-container-sm);
  padding: 8px 10px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.bar__file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.rows {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 7px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
}
.row:last-child {
  border-bottom: none;
}
.row__label {
  width: 88px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.row__value {
  flex: 1;
  font-size: var(--fs-sm);
  user-select: all;
  word-break: break-all;
}
.zones {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.zones__title {
  padding: 8px var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.zone {
  display: flex;
  justify-content: space-between;
  padding: 7px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-sm);
}
.zone:last-child {
  border-bottom: none;
}
.zone__name {
  color: var(--c-text-2);
}
</style>
