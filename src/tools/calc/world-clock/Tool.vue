<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CITIES, timeOf, type CityTime } from './logic'

const rows = ref<CityTime[]>(CITIES.map((c) => timeOf(c)))
let timer: ReturnType<typeof setInterval> | undefined

function tick(): void {
  rows.value = CITIES.map((c) => timeOf(c))
}

onMounted(() => {
  timer = setInterval(tick, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="clock">
    <div class="head">
      <span class="u-xs u-dim">本地时区：{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}</span>
      <span class="u-grow" />
      <span class="u-xs u-dim">每秒刷新</span>
    </div>

    <div class="grid">
      <div v-for="row in rows" :key="row.city.zone" :class="['card', { 'is-night': row.isNight }]">
        <div class="card__top">
          <span class="card__city">{{ row.city.name }}</span>
          <span class="card__dot" aria-hidden="true" />
        </div>
        <div class="card__time">{{ row.time }}</div>
        <div class="card__date">{{ row.date }} {{ row.weekday }}</div>
        <div class="card__offset">{{ row.offset }}</div>
      </div>
    </div>

    <p class="tip">浅色卡片表示当地处于白天（06:00–19:00），深色表示夜间。</p>
  </div>
</template>

<style scoped>
.clock {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.head {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: var(--sp-2);
}
.card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
  transition: background var(--dur-base) var(--ease);
}
.card.is-night {
  background: linear-gradient(160deg, #2b3150, #232840);
  color: #e8eaf4;
  box-shadow:
    4px 4px 12px rgb(159 166 199 / 30%),
    inset 0 0 0 1px rgb(255 255 255 / 8%);
}
.card__top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.card__city {
  font-size: var(--fs-sm);
  font-weight: 500;
}
.card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-ok);
}
.card.is-night .card__dot {
  background: var(--c-cat-calc);
}
.card__time {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.25;
}
.card__date {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.card.is-night .card__date {
  color: rgb(232 234 244 / 62%);
}
.card__offset {
  margin-top: 2px;
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.card.is-night .card__offset {
  color: rgb(232 234 244 / 52%);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
</style>
