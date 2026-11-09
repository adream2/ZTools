<script setup lang="ts">
defineProps<{ text?: string; hint?: string; icon?: boolean }>()
</script>

<template>
  <div class="empty">
    <span v-if="icon !== false" class="empty__icon" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="5" width="18" height="14" rx="4" />
        <path d="M7 10h10M7 14h6" stroke-linecap="round" />
      </svg>
    </span>
    <div class="empty__text">{{ text || '暂无内容' }}</div>
    <div v-if="hint" class="empty__hint">{{ hint }}</div>
    <slot />
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: var(--sp-6) var(--sp-4);
  color: var(--c-text-3);
  text-align: center;
}
.empty__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
  color: var(--c-text-3);
}
.empty__text {
  font-size: var(--fs-md);
  color: var(--c-text-2);
}
.empty__hint {
  font-size: var(--fs-xs);
}
</style>
