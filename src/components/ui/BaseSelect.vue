<script setup lang="ts">
const model = defineModel<string | number>({ default: '' })

withDefaults(
  defineProps<{
    options: { label: string; value: string | number }[]
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  { size: 'md', disabled: false },
)
</script>

<template>
  <select v-model="model" :class="['sel', `sel--${size}`]" :disabled="disabled">
    <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
  </select>
</template>

<style scoped>
.sel {
  width: 100%;
  appearance: none;
  background-color: var(--c-surface-2);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa0b8' stroke-width='2.5'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 11px center;
  border: none;
  border-radius: var(--radius-control-sm);
  color: var(--c-text);
  padding-right: 30px;
  cursor: pointer;
  box-shadow: var(--clay-inset);
  transition: box-shadow var(--dur-fast) var(--ease);
}
.sel--md {
  height: 40px;
  padding-left: 14px;
  font-size: var(--fs-md);
}
.sel--sm {
  height: 32px;
  padding-left: 11px;
  font-size: var(--fs-sm);
}
.sel:focus {
  outline: none;
  box-shadow:
    var(--clay-inset),
    var(--ring);
}
.sel:disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
