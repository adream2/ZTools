<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'subtle' | 'ghost' | 'danger'
    size?: 'sm' | 'md'
    disabled?: boolean
    loading?: boolean
    block?: boolean
    tooltip?: string
    type?: 'button' | 'submit'
  }>(),
  { variant: 'subtle', size: 'md', disabled: false, loading: false, block: false, type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'is-loading': loading }]"
    :disabled="disabled || loading"
    :title="tooltip"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  border-radius: var(--radius-control-sm);
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
  transition:
    box-shadow var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}
.btn--md {
  height: 40px;
  padding: 0 18px;
  font-size: var(--fs-md);
}
.btn--sm {
  height: 32px;
  padding: 0 13px;
  font-size: var(--fs-sm);
}
.btn--block {
  width: 100%;
}

/* 次要：浮起的黏土块 */
.btn--subtle {
  background: var(--c-surface);
  color: var(--c-text);
  box-shadow: var(--clay-raised-sm);
}
.btn--subtle:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--clay-raised);
}
.btn--subtle:active:not(:disabled) {
  transform: none;
  box-shadow: var(--clay-pressed);
}

/* 主按钮：同色系柔光，不用生硬描边 */
.btn--primary {
  background: linear-gradient(180deg, #6f7eff, var(--c-accent));
  color: #fff;
  box-shadow:
    0 5px 14px rgb(91 108 255 / 34%),
    inset 0 1px 0 rgb(255 255 255 / 28%),
    inset 0 -2px 6px rgb(40 50 160 / 22%);
}
.btn--primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #7b89ff, var(--c-accent-hover));
  transform: translateY(-1px);
  box-shadow:
    0 8px 20px rgb(91 108 255 / 40%),
    inset 0 1px 0 rgb(255 255 255 / 32%);
}
.btn--primary:active:not(:disabled) {
  transform: none;
  box-shadow:
    inset 0 3px 10px rgb(30 38 120 / 34%),
    inset 0 -1px 0 rgb(255 255 255 / 16%);
}

.btn--ghost {
  background: transparent;
  color: var(--c-text-2);
}
.btn--ghost:hover:not(:disabled) {
  background: var(--c-bg-subtle);
  color: var(--c-text);
  box-shadow: var(--clay-inset);
}
.btn--ghost:active:not(:disabled) {
  box-shadow: var(--clay-pressed);
}

.btn--danger {
  background: var(--c-danger-weak);
  color: var(--c-danger);
  box-shadow: var(--clay-raised-sm);
}
.btn--danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--clay-raised);
}
.btn--danger:active:not(:disabled) {
  transform: none;
  box-shadow: var(--clay-pressed);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}
.btn__spinner {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
