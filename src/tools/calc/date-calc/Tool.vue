<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  addDelta,
  ageOf,
  breakdown,
  dayOfYear,
  formatDate,
  isLeapYear,
  parseDate,
  today,
  totalDaysInYear,
  weekdayOf,
} from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const mode = ref('diff')
const tabs = [
  { id: 'diff', label: '日期相差' },
  { id: 'add', label: '日期加减' },
  { id: 'age', label: '年龄计算' },
]

const start = ref(today())
const end = ref(today())
const base = ref(today())
const dy = ref('0')
const dm = ref('0')
const dd = ref('0')
const birth = ref('2000-01-01')

const diff = computed(() => {
  try {
    return { data: breakdown(parseDate(start.value), parseDate(end.value)), error: '' }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const added = computed(() => {
  try {
    const d = addDelta(parseDate(base.value), { years: Number(dy.value) || 0, months: Number(dm.value) || 0, days: Number(dd.value) || 0 })
    return { date: d, text: formatDate(d), week: weekdayOf(d), error: '' }
  } catch (e) {
    return { date: null, text: '', week: '', error: e instanceof Error ? e.message : String(e) }
  }
})

const age = computed(() => {
  try {
    const b = parseDate(birth.value)
    return { data: ageOf(b), error: '' }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const dayInfo = computed(() => {
  try {
    const d = parseDate(base.value)
    return `一年中的第 ${dayOfYear(d)} 天 / 共 ${totalDaysInYear(d.getFullYear())} 天${isLeapYear(d.getFullYear()) ? '（闰年）' : ''}`
  } catch {
    return ''
  }
})

function setToday(target: 'start' | 'end' | 'base'): void {
  if (target === 'start') start.value = today()
  if (target === 'end') end.value = today()
  if (target === 'base') base.value = today()
}
</script>

<template>
  <div class="dc">
    <BaseTabs v-model="mode" :tabs="tabs" />

    <template v-if="mode === 'diff'">
      <div class="row">
        <Field label="开始日期">
          <input v-model="start" type="date" class="date" />
        </Field>
        <Field label="结束日期">
          <input v-model="end" type="date" class="date" />
        </Field>
        <button type="button" class="link" @click="setToday('start'); setToday('end')">都用今天</button>
      </div>

      <p v-if="diff.error" class="err">{{ diff.error }}</p>

      <template v-if="diff.data">
        <div class="hero">
          <div class="hero__n">{{ diff.data.days }}</div>
          <div class="hero__u">天</div>
        </div>
        <div class="grid">
          <div class="cell"><span>按年月日</span><b>{{ diff.data.yearsMonthsDays }}</b></div>
          <div class="cell"><span>周</span><b>{{ diff.data.weeks }} 周 {{ diff.data.days % 7 }} 天</b></div>
          <div class="cell"><span>约月数</span><b>{{ diff.data.months }} 个月</b></div>
          <div class="cell"><span>约年数</span><b>{{ diff.data.years }} 年</b></div>
          <div class="cell"><span>工作日</span><b>{{ diff.data.workdays }} 天</b></div>
          <div class="cell"><span>周末</span><b>{{ diff.data.weekend }} 天</b></div>
        </div>
      </template>
    </template>

    <template v-else-if="mode === 'add'">
      <div class="row">
        <Field label="基准日期">
          <input v-model="base" type="date" class="date" />
        </Field>
        <Field label="加 / 减 天数" hint="负数表示往前推">
          <BaseInput v-model="dd" type="number" mono />
        </Field>
        <Field label="月">
          <BaseInput v-model="dm" type="number" mono />
        </Field>
        <Field label="年">
          <BaseInput v-model="dy" type="number" mono />
        </Field>
      </div>

      <p v-if="added.error" class="err">{{ added.error }}</p>

      <template v-if="added.text">
        <div class="hero hero--date">
          <div class="hero__date">{{ added.text }}</div>
          <div class="hero__sub">{{ added.week }} · {{ dayInfo }}</div>
        </div>
        <div class="u-row">
          <CopyButton :text="added.text" label="复制日期" size="md" />
          <span class="u-xs u-dim">月份加减会自动处理月末（如 1 月 31 日加一个月为 2 月最后一天）</span>
        </div>
      </template>
    </template>

    <template v-else>
      <div class="row">
        <Field label="出生日期">
          <input v-model="birth" type="date" class="date" />
        </Field>
        <button type="button" class="link" @click="setToday('base')">用今天作基准</button>
      </div>

      <p v-if="age.error" class="err">{{ age.error }}</p>

      <template v-if="age.data">
        <div class="hero">
          <div class="hero__n">{{ age.data.years }}</div>
          <div class="hero__u">周岁</div>
          <div class="hero__sub">生肖 {{ age.data.zodiac }}</div>
        </div>
        <div class="grid">
          <div class="cell"><span>精确年龄</span><b>{{ age.data.years }} 年 {{ age.data.months }} 个月 {{ age.data.days }} 天</b></div>
          <div class="cell"><span>累计天数</span><b>{{ age.data.totalDays.toLocaleString() }} 天</b></div>
          <div class="cell"><span>距下次生日</span><b>{{ age.data.nextBirthdayDays }} 天</b></div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.dc {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.row {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.date {
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  color: var(--c-text);
  font-size: var(--fs-md);
}
.date:focus {
  outline: none;
  border-color: var(--c-accent);
  box-shadow: var(--ring);
}
.link {
  font-size: var(--fs-xs);
  color: var(--c-accent);
  padding-bottom: 10px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.hero {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--c-bg-subtle);
  border: 1px solid var(--c-border);
  flex-wrap: wrap;
}
.hero__n {
  font-family: var(--font-mono);
  font-size: 40px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
}
.hero__u {
  font-size: var(--fs-md);
  color: var(--c-text-2);
}
.hero__sub {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.hero--date {
  flex-direction: column;
  gap: 2px;
}
.hero__date {
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 600;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-2);
}
.cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 9px var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
}
.cell span {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.cell b {
  font-size: var(--fs-md);
  font-weight: 500;
}
</style>
