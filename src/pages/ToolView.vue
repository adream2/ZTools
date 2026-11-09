<script setup lang="ts">
import { computed, defineAsyncComponent, onErrorCaptured, ref, watch } from 'vue'
import ToolPanel from '@/components/layout/ToolPanel.vue'
import NotFound from './NotFound.vue'
import { getTool } from '@/core/registry'
import { pushRecent } from '@/core/prefs'
import EmptyState from '@/components/ui/EmptyState.vue'
import AdSlot from '@/components/ads/AdSlot.vue'

const props = defineProps<{ id: string }>()

const def = computed(() => getTool(props.id))
const loadError = ref('')

const view = computed(() => {
  const d = def.value
  if (!d) return null
  return defineAsyncComponent({
    loader: d.component as () => Promise<never>,
    delay: 80,
    timeout: 15000,
    onError(err, retry, fail) {
      loadError.value = err instanceof Error ? err.message : String(err)
      if (loadError.value.includes('Failed to fetch dynamically imported module')) {
        fail()
      } else {
        retry()
      }
    },
  })
})

watch(
  () => props.id,
  (id) => {
    loadError.value = ''
    pushRecent(id)
  },
  { immediate: true },
)

onErrorCaptured((err) => {
  loadError.value = err instanceof Error ? err.message : String(err)
  return false
})
</script>

<template>
  <NotFound v-if="!def" />
  <ToolPanel
    v-else
    :title="def.meta.title"
    :summary="def.meta.summary"
    :privacy="def.meta.privacy ?? 'local'"
    :network-hosts="def.meta.networkHosts"
    :badge="def.meta.badge"
    :category="def.meta.category"
    :tips="def.meta.tips"
  >
    <div v-if="loadError" class="load-error">
      <EmptyState text="工具加载失败" :hint="loadError">
        <button type="button" class="retry" @click="loadError = ''; $router.go(0)">重新加载</button>
      </EmptyState>
    </div>
    <Suspense v-else>
      <component :is="view" :key="def.meta.id" />
      <template #fallback>
        <div class="skeleton">
          <div class="skeleton__bar" style="width: 32%" />
          <div class="skeleton__block" />
          <div class="skeleton__bar" style="width: 18%" />
        </div>
      </template>
    </Suspense>
    <AdSlot placement="toolBottom" :min-height="160" />
  </ToolPanel>
</template>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.skeleton__bar {
  height: 12px;
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
}
.skeleton__block {
  height: 200px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.55;
  }
}
.retry {
  margin-top: var(--sp-3);
  color: var(--c-accent);
  font-size: var(--fs-sm);
}
.load-error {
  padding: var(--sp-4) 0;
}
</style>
