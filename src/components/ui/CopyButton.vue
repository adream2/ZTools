<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{ text: string; label?: string; size?: 'sm' | 'md'; variant?: 'subtle' | 'ghost' }>(), {
  label: '复制',
  size: 'sm',
  variant: 'ghost',
})

const copied = ref(false)

async function copy(): Promise<void> {
  if (!props.text) return
  try {
    await navigator.clipboard.writeText(props.text)
  } catch {
    const el = document.createElement('textarea')
    el.value = props.text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1400)
}
</script>

<template>
  <button
    type="button"
    :class="['copy', `copy--${variant}`, `copy--${size}`, { 'is-done': copied }]"
    title="复制到剪贴板"
    @click="copy"
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="3" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
    {{ copied ? '已复制' : label }}
  </button>
</template>

<style scoped>
.copy {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: var(--radius-pill);
  color: var(--c-text-2);
  transition:
    all var(--dur-fast) var(--ease);
  white-space: nowrap;
  flex: none;
}
.copy--sm {
  height: 27px;
  padding: 0 10px;
  font-size: var(--fs-xs);
}
.copy--md {
  height: 34px;
  padding: 0 13px;
  font-size: var(--fs-sm);
}
.copy--subtle {
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
}
.copy--ghost {
  background: transparent;
}
.copy:hover {
  color: var(--c-text);
  box-shadow: var(--clay-raised);
}
.copy--ghost:hover {
  background: var(--c-bg-subtle);
  box-shadow: var(--clay-inset);
}
.copy:active {
  box-shadow: var(--clay-pressed);
}
.copy.is-done {
  color: var(--c-ok);
  box-shadow: var(--clay-raised-sm);
}
</style>
