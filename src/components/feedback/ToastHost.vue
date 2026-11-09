<script setup lang="ts">
import { dismiss, toasts } from '@/core/toast'
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" :class="['toast', `toast--${t.type}`]" @click="dismiss(t.id)">
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  max-width: min(92vw, 440px);
  padding: 9px 18px;
  border-radius: var(--radius-pill);
  background: var(--c-text);
  color: var(--c-bg);
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-2);
  cursor: pointer;
  white-space: pre-wrap;
  word-break: break-word;
}
.toast--ok {
  background: var(--c-ok);
  color: #fff;
}
.toast--error {
  background: var(--c-danger);
  color: #fff;
}
.toast-enter-active,
.toast-leave-active {
  transition: all var(--dur-base) var(--ease);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}
</style>
