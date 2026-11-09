<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 分类色 CSS 变量，例如 --c-cat-dev */
    tone?: string
    size?: 'sm' | 'md' | 'lg'
    /** 24x24 viewBox 的 path */
    path?: string
  }>(),
  { tone: 'var(--c-accent)', size: 'md' },
)
</script>

<template>
  <span class="ci" :class="`ci--${size}`" :style="{ '--ci-tone': tone }">
    <svg v-if="path" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path :d="path" />
    </svg>
    <slot v-else />
  </span>
</template>

<style scoped>
.ci {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: var(--radius-control-md);
  color: var(--ci-tone);
  background: color-mix(in srgb, var(--ci-tone) 12%, var(--c-surface));
  box-shadow:
    3px 3px 9px color-mix(in srgb, var(--ci-tone) 22%, transparent),
    -2px -2px 7px rgb(255 255 255 / 85%),
    inset 0 1px 0 rgb(255 255 255 / 60%);
}
.ci--sm {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-control-sm);
}
.ci--md {
  width: 38px;
  height: 38px;
}
.ci--lg {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-container-sm);
}
.ci svg {
  width: 58%;
  height: 58%;
}

:global([data-theme='dark']) .ci {
  background: color-mix(in srgb, var(--ci-tone) 18%, var(--c-surface));
  box-shadow:
    2px 2px 8px rgb(0 0 0 / 34%),
    inset 0 0 0 1px rgb(255 255 255 / 7%),
    inset 0 1px 0 rgb(255 255 255 / 10%);
}
</style>
