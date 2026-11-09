<script setup lang="ts">
import type { PrivacyLevel } from '@/core/types'

defineProps<{ level: PrivacyLevel; hosts?: string[] }>()
</script>

<template>
  <span
    :class="['badge', level === 'local' ? 'badge--local' : 'badge--net']"
    :title="level === 'local' ? '所有计算在浏览器内完成，数据不会发送到任何服务器' : `需要访问外部服务：${hosts?.join('、') || '第三方接口'}`"
  >
    <svg v-if="level === 'local'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
    <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18" />
    </svg>
    {{ level === 'local' ? '本地处理' : '需联网' }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 9px;
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}
.badge--local {
  color: var(--c-ok);
  background: color-mix(in srgb, var(--c-ok) 12%, var(--c-surface));
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--c-ok) 26%, transparent),
    1px 1px 3px rgb(159 166 199 / 18%);
}
.badge--net {
  color: var(--c-warn);
  background: var(--c-warn-weak);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--c-warn) 26%, transparent),
    1px 1px 3px rgb(159 166 199 / 18%);
}
</style>
