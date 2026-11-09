<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    type?: string
    mono?: boolean
    size?: 'sm' | 'md'
    disabled?: boolean
    invalid?: boolean
    autocomplete?: string
    spellcheck?: boolean
  }>(),
  { type: 'text', mono: false, size: 'md', disabled: false, invalid: false, autocomplete: 'off', spellcheck: false },
)
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :class="['inp', `inp--${size}`, { 'inp--mono': mono, 'is-invalid': invalid }]"
    :placeholder="placeholder"
    :disabled="disabled"
    :autocomplete="autocomplete"
    :spellcheck="spellcheck"
  />
</template>

<style scoped>
.inp {
  width: 100%;
  background: var(--c-surface-2);
  border: none;
  border-radius: var(--radius-control-sm);
  color: var(--c-text);
  box-shadow: var(--clay-inset);
  transition: box-shadow var(--dur-fast) var(--ease);
}
.inp--md {
  height: 40px;
  padding: 0 14px;
  font-size: var(--fs-md);
}
.inp--sm {
  height: 32px;
  padding: 0 11px;
  font-size: var(--fs-sm);
}
.inp--mono {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}
.inp::placeholder {
  color: var(--c-text-3);
}
.inp:focus {
  outline: none;
  box-shadow:
    var(--clay-inset),
    var(--ring);
}
.inp:disabled {
  color: var(--c-text-3);
  cursor: not-allowed;
  opacity: 0.7;
}
.is-invalid {
  box-shadow:
    var(--clay-inset),
    0 0 0 2px color-mix(in srgb, var(--c-danger) 45%, transparent);
}
</style>
