<script setup lang="ts">
const model = defineModel<string>({ default: '' })
defineProps<{ tabs: { id: string; label: string }[] }>()
</script>

<template>
  <div class="tabs" role="tablist">
    <button
      v-for="t in tabs"
      :key="t.id"
      role="tab"
      type="button"
      :aria-selected="model === t.id"
      :class="['tabs__item', { 'is-active': model === t.id }]"
      @click="model = t.id"
    >
      {{ t.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: inline-flex;
  gap: 3px;
  padding: 4px;
  background: var(--c-surface-2);
  border-radius: var(--radius-pill);
  box-shadow: var(--clay-inset);
}
.tabs__item {
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  transition:
    color var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease);
}
.tabs__item:hover {
  color: var(--c-text);
}
.tabs__item.is-active {
  background: var(--c-surface);
  color: var(--c-text);
  box-shadow: var(--clay-raised-sm);
}
</style>
