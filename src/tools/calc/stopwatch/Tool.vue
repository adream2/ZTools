<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { formatMs, lapStats, type Lap } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import CopyButton from '@/components/ui/CopyButton.vue'

const running = ref(false)
const elapsed = ref(0)
const laps = ref<Lap[]>([])

let raf = 0
let startedAt = 0
let base = 0

function loop(): void {
  elapsed.value = base + (performance.now() - startedAt)
  raf = requestAnimationFrame(loop)
}

function start(): void {
  if (running.value) return
  running.value = true
  base = elapsed.value
  startedAt = performance.now()
  raf = requestAnimationFrame(loop)
}

function pause(): void {
  if (!running.value) return
  running.value = false
  cancelAnimationFrame(raf)
  elapsed.value = base + (performance.now() - startedAt)
}

function reset(): void {
  pause()
  elapsed.value = 0
  base = 0
  laps.value = []
}

function lap(): void {
  if (!running.value) return
  const total = elapsed.value
  const prev = laps.value.at(-1)?.total ?? 0
  laps.value = [...laps.value, { index: laps.value.length + 1, total, split: total - prev }]
}

const stats = computed(() => lapStats(laps.value))
const lapText = computed(() =>
  laps.value.map((l) => `#${l.index}\t${formatMs(l.total)}\t+${formatMs(l.split)}`).join('\n'),
)
</script>

<template>
  <div class="sw">
    <div class="clock clay-card">
      <div class="clock__time">{{ formatMs(elapsed) }}</div>
      <div v-if="stats" class="clock__stats">
        <span>最快 <b>{{ formatMs(stats.best) }}</b></span>
        <span>最慢 <b>{{ formatMs(stats.worst) }}</b></span>
        <span>平均 <b>{{ formatMs(stats.average) }}</b></span>
      </div>
    </div>

    <div class="actions">
      <BaseButton v-if="!running" variant="primary" @click="start">开始</BaseButton>
      <BaseButton v-else @click="pause">暂停</BaseButton>
      <BaseButton :disabled="!running" @click="lap">计次</BaseButton>
      <BaseButton variant="ghost" :disabled="elapsed === 0 && !laps.length" @click="reset">重置</BaseButton>
      <CopyButton v-if="laps.length" :text="lapText" label="复制计次" size="md" />
    </div>

    <div v-if="laps.length" class="laps clay-list">
      <div class="laps__head">
        <span>#</span>
        <span>累计</span>
        <span>分段</span>
      </div>
      <div v-for="l in [...laps].reverse()" :key="l.index" class="laps__row">
        <span class="laps__idx">{{ l.index }}</span>
        <span class="laps__t">{{ formatMs(l.total) }}</span>
        <span :class="['laps__s', { 'is-best': stats && l.split === stats.best }]">+{{ formatMs(l.split) }}</span>
      </div>
    </div>

    <p class="tip">使用 requestAnimationFrame 计时，精度约 16ms；切到后台标签页会暂停刷新，回来会按真实时间补齐。</p>
  </div>
</template>

<style scoped>
.sw {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--sp-5);
  border-radius: var(--radius-container-lg);
}
.clock__time {
  font-family: var(--font-mono);
  font-size: 56px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.clock__stats {
  display: flex;
  gap: var(--sp-4);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.clock__stats b {
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-weight: 500;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.laps {
  overflow: hidden;
}
.laps__head,
.laps__row {
  display: grid;
  grid-template-columns: 48px 1fr 1fr;
  gap: var(--sp-2);
  padding: 8px 14px;
  font-size: var(--fs-sm);
}
.laps__head {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-subtle);
}
.laps__row {
  border-bottom: 1px solid var(--c-border);
  font-family: var(--font-mono);
}
.laps__row:last-child {
  border-bottom: none;
}
.laps__idx {
  color: var(--c-text-3);
}
.laps__s.is-best {
  color: var(--c-ok);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
