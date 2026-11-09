<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { PHASES, chime, formatClock, nextPhase, type Phase } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'

const phase = ref<Phase>('focus')
const remaining = ref(PHASES.focus.minutes * 60)
const running = ref(false)
const completed = ref(0)

let timer: ReturnType<typeof setInterval> | undefined

const total = computed(() => PHASES[phase.value].minutes * 60)
const progress = computed(() => 1 - remaining.value / total.value)
const accent = computed(() => PHASES[phase.value].color)

const R = 76
const CIRC = 2 * Math.PI * R

function tick(): void {
  if (remaining.value > 0) {
    remaining.value -= 1
    return
  }
  finish()
}

function finish(): void {
  chime()
  const next = nextPhase(phase.value, completed.value)
  phase.value = next.phase
  completed.value = next.completed
  remaining.value = PHASES[next.phase].minutes * 60
  pause()
}

function start(): void {
  if (running.value) return
  running.value = true
  timer = setInterval(tick, 1000)
}

function pause(): void {
  running.value = false
  if (timer) clearInterval(timer)
  timer = undefined
}

function reset(): void {
  pause()
  remaining.value = total.value
}

function skip(): void {
  const next = nextPhase(phase.value, completed.value)
  phase.value = next.phase
  completed.value = next.completed
  remaining.value = PHASES[next.phase].minutes * 60
  pause()
}

function switchTo(p: Phase): void {
  pause()
  phase.value = p
  remaining.value = PHASES[p].minutes * 60
}

onBeforeUnmount(() => pause())
</script>

<template>
  <div class="pomo">
    <div class="phases">
      <button
        v-for="(v, k) in PHASES"
        :key="k"
        type="button"
        :class="['phase', { 'is-on': phase === k }]"
        @click="switchTo(k as Phase)"
      >
        {{ v.label }} · {{ v.minutes }} 分
      </button>
    </div>

    <div class="ring-wrap">
      <svg class="ring" viewBox="0 0 180 180" :style="{ '--accent': accent }">
        <circle class="ring__bg" cx="90" cy="90" :r="R" />
        <circle
          class="ring__fg"
          cx="90"
          cy="90"
          :r="R"
          :stroke-dasharray="CIRC"
          :stroke-dashoffset="CIRC * (1 - progress)"
        />
      </svg>
      <div class="ring__center">
        <div class="ring__time">{{ formatClock(remaining) }}</div>
        <div class="ring__label">{{ PHASES[phase].label }}</div>
      </div>
    </div>

    <div class="actions">
      <BaseButton v-if="!running" variant="primary" @click="start">开始</BaseButton>
      <BaseButton v-else @click="pause">暂停</BaseButton>
      <BaseButton variant="ghost" @click="reset">重置</BaseButton>
      <BaseButton variant="ghost" @click="skip">跳过</BaseButton>
    </div>

    <div class="meta">
      <span>已完成番茄：<b>{{ completed }}</b> 个</span>
      <span class="u-dim">每 4 个番茄进入长休息</span>
    </div>

    <p class="tip">计时在页面内进行，切到后台标签页时浏览器可能降低精度，回来会按实际剩余时间显示。</p>
  </div>
</template>

<style scoped>
.pomo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-4) 0;
}
.phases {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}
.phase {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: var(--c-surface);
  color: var(--c-text-2);
  font-size: var(--fs-sm);
  box-shadow: var(--clay-raised-sm);
}
.phase.is-on {
  background: var(--c-surface-2);
  color: var(--c-text);
  box-shadow: var(--clay-pressed);
}
.ring-wrap {
  position: relative;
  width: 260px;
  height: 260px;
  display: grid;
  place-items: center;
}
.ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.ring__bg {
  fill: none;
  stroke: var(--c-surface-2);
  stroke-width: 14;
}
.ring__fg {
  fill: none;
  stroke: var(--accent);
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.9s linear, stroke 0.3s;
}
.ring__center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.ring__time {
  font-family: var(--font-mono);
  font-size: 44px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
}
.ring__label {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
}
.actions {
  display: flex;
  gap: var(--sp-2);
}
.meta {
  display: flex;
  gap: var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--c-text-2);
}
.meta b {
  color: var(--c-accent);
  font-family: var(--font-mono);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  text-align: center;
  max-width: 440px;
}
</style>
