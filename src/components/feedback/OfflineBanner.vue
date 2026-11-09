<script setup lang="ts">
import { online } from '@/core/net'
</script>

<template>
  <Transition name="offline">
    <div v-if="!online" class="offline" role="status">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
        <path d="M3 3l18 18M8.5 8.5a7 7 0 0 1 9 0M5 12a11 11 0 0 1 3-2M12 19h.01" stroke-linecap="round" />
      </svg>
      当前离线，本地工具仍可使用
    </div>
  </Transition>
</template>

<style scoped>
.offline {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 150;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: var(--radius-pill);
  background: var(--c-warn-weak);
  color: var(--c-warn);
  font-size: var(--fs-xs);
  box-shadow: var(--clay-raised-sm);
}
.offline-enter-active,
.offline-leave-active {
  transition: all var(--dur-base) var(--ease);
}
.offline-enter-from,
.offline-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
