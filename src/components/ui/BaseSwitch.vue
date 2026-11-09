<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
withDefaults(defineProps<{ disabled?: boolean; label?: string }>(), { disabled: false })
</script>

<template>
  <label class="sw" :class="{ 'is-disabled': disabled }">
    <input v-model="model" type="checkbox" role="switch" :disabled="disabled" />
    <span class="sw__track" aria-hidden="true"><span class="sw__dot" /></span>
    <span v-if="label" class="sw__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.sw {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  cursor: pointer;
  user-select: none;
}
.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.sw__track {
  width: 38px;
  height: 22px;
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  position: relative;
  transition: background var(--dur-base) var(--ease);
  flex: none;
}
.sw__dot {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-surface);
  box-shadow:
    1px 1px 3px rgb(159 166 199 / 45%),
    -1px -1px 2px rgb(255 255 255 / 90%);
  transition: transform var(--dur-base) var(--ease);
}
input:checked + .sw__track {
  background: linear-gradient(180deg, #6f7eff, var(--c-accent));
}
input:checked + .sw__track .sw__dot {
  transform: translateX(16px);
  box-shadow:
    1px 1px 4px rgb(40 50 160 / 40%),
    inset 0 1px 0 rgb(255 255 255 / 90%);
}
input:focus-visible + .sw__track {
  box-shadow:
    var(--clay-inset),
    var(--ring);
}
.sw__label {
  font-size: var(--fs-md);
}
</style>
