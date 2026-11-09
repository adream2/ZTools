<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
    mono?: boolean
    disabled?: boolean
    readonly?: boolean
    resize?: 'none' | 'vertical' | 'both'
    invalid?: boolean
  }>(),
  { rows: 8, mono: true, disabled: false, readonly: false, resize: 'vertical', invalid: false },
)
</script>

<template>
  <textarea
    v-model="model"
    :class="['ta', { 'ta--mono': mono, 'is-invalid': invalid, 'is-readonly': readonly }]"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :style="{ resize }"
    spellcheck="false"
    autocomplete="off"
  />
</template>

<style scoped>
.ta {
  width: 100%;
  min-height: 96px;
  padding: 14px 15px;
  background: var(--c-surface-2);
  border: none;
  border-radius: var(--radius-control-sm);
  color: var(--c-text);
  line-height: var(--lh-code);
  tab-size: 2;
  box-shadow: var(--clay-inset);
  transition: box-shadow var(--dur-fast) var(--ease);
}
.ta--mono {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}
.ta::placeholder {
  color: var(--c-text-3);
}
.ta:focus {
  outline: none;
  box-shadow:
    var(--clay-inset),
    var(--ring);
}
.ta:disabled {
  color: var(--c-text-3);
  opacity: 0.7;
}
.is-readonly {
  color: var(--c-text);
}
.is-invalid {
  box-shadow:
    var(--clay-inset),
    0 0 0 2px color-mix(in srgb, var(--c-danger) 45%, transparent);
}
</style>
