<script setup lang="ts">
import { applyUpdate, needRefresh } from '@/core/pwa'

function later(): void {
  needRefresh.value = false
}
</script>

<template>
  <Transition name="bar">
    <div v-if="needRefresh" class="bar" role="status">
      <span>有新版本可用，刷新后生效。</span>
      <button type="button" class="bar__btn" @click="applyUpdate">立即更新</button>
      <button type="button" class="bar__close" aria-label="稍后" @click="later">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.bar {
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  z-index: 320;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 7px 8px 7px 16px;
  border-radius: var(--radius-pill);
  background: var(--c-surface);
  color: var(--c-text);
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-2), var(--clay-raised-sm);
  max-width: 92vw;
}
.bar__btn {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: linear-gradient(180deg, #6f7eff, var(--c-accent));
  color: #fff;
  font-size: var(--fs-sm);
  flex: none;
  box-shadow: 0 4px 12px rgb(91 108 255 / 32%);
}
.bar__btn:active {
  box-shadow: var(--clay-pressed);
}
.bar__close {
  color: var(--c-text-3);
  font-size: 17px;
  line-height: 1;
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
.bar__close:hover {
  color: var(--c-text);
  background: var(--c-bg-subtle);
}
.bar-enter-active,
.bar-leave-active {
  transition: all var(--dur-base) var(--ease);
}
.bar-enter-from,
.bar-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
