<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'raised' | 'inset'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    interactive?: boolean
    sm?: boolean
  }>(),
  { tone: 'raised', padding: 'md', interactive: false, sm: false },
)
</script>

<template>
  <div
    :class="[
      'clay',
      `clay--${tone}`,
      `clay--pad-${padding}`,
      { 'clay--interactive': interactive, 'clay--sm': sm },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.clay {
  border-radius: var(--radius-container-md);
  contain: paint;
}
.clay--sm {
  border-radius: var(--radius-container-sm);
}
.clay--raised {
  background: var(--c-surface);
  box-shadow: var(--clay-raised);
}
.clay--inset {
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
}
.clay--pad-none {
  padding: 0;
}
.clay--pad-sm {
  padding: var(--sp-3);
}
.clay--pad-md {
  padding: var(--sp-4);
}
.clay--pad-lg {
  padding: var(--sp-5);
}
.clay--interactive {
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
  cursor: pointer;
}
.clay--interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}
.clay--interactive:active {
  transform: none;
  box-shadow: var(--clay-pressed);
}
</style>
