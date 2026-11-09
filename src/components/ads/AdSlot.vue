<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ADSENSE_CLIENT, slotOf, type AdPlacement } from '@/core/site-config'

const props = withDefaults(
  defineProps<{
    placement: AdPlacement
    /** 广告单元格式：auto 自适应，rectangle 矩形，horizontal 横幅 */
    format?: 'auto' | 'rectangle' | 'horizontal'
    /** 预留高度，避免广告加载后页面跳动（CLS） */
    minHeight?: number
    label?: string
  }>(),
  { format: 'auto', minHeight: 120, label: '广告' },
)

const slot = slotOf(props.placement)
const ready = ref(false)

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

onMounted(() => {
  if (!slot) return
  try {
    // AdSense 脚本由 index.html 注入，这里只做单次 push
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    ready.value = true
  } catch {
    /* 广告被拦截或脚本未加载时不报错，保持页面可用 */
  }
})
</script>

<template>
  <aside v-if="slot" class="ad" :style="{ minHeight: `${minHeight}px` }" aria-label="广告">
    <span class="ad__label">{{ label }}</span>
    <ins
      class="adsbygoogle ad__unit"
      :data-ad-client="ADSENSE_CLIENT"
      :data-ad-slot="slot"
      :data-ad-format="format"
      data-full-width-responsive="true"
    />
    <span v-if="!ready" class="ad__hint">广告位</span>
  </aside>
</template>

<style scoped>
.ad {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  overflow: hidden;
}
.ad__label {
  position: absolute;
  top: 4px;
  left: 10px;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--c-text-3);
  opacity: 0.7;
}
.ad__unit {
  display: block;
  width: 100%;
}
.ad__hint {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  opacity: 0.5;
}
</style>
