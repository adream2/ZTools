<script setup lang="ts">
import { computed, defineAsyncComponent, onErrorCaptured, ref, watch } from 'vue'
import ToolPanel from '@/components/layout/ToolPanel.vue'
import NotFound from './NotFound.vue'
import { getTool } from '@/core/registry'
import { pushRecent } from '@/core/prefs'
import EmptyState from '@/components/ui/EmptyState.vue'
import AdSlot from '@/components/ads/AdSlot.vue'
import { topicsOfTool } from '@/content/topics'
import { similarTools } from '@/core/related'

const props = defineProps<{ id: string }>()

const def = computed(() => getTool(props.id))
const loadError = ref('')

const toolTopics = computed(() => (def.value ? topicsOfTool(def.value.meta.id) : []))
const primaryTopic = computed(() => toolTopics.value[0] ?? null)

/**
 * 页内互链：优先用「同专题」，没有归属专题时退回到相似工具推荐。
 * 两者共用一套渲染，避免工具页底部出现两个区块。
 */
const relatedBlock = computed(() => {
  const id = def.value?.meta.id
  if (!id) return null

  const topic = primaryTopic.value
  const items = topic
    ? topic.tools
        .filter((x) => x !== id)
        .map((x) => getTool(x))
        .filter((x): x is NonNullable<typeof x> => !!x)
        .slice(0, 6)
    : similarTools(id, 6)

  if (!items.length) return null
  return {
    title: topic ? `同专题 · ${topic.title}` : '相关工具',
    moreTo: topic ? `/topics/${topic.id}` : '',
    items,
  }
})

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
    <section v-if="relatedBlock" class="rel">
      <div class="rel__head">
        <h2 class="rel__title">{{ relatedBlock.title }}</h2>
        <RouterLink v-if="relatedBlock.moreTo" :to="relatedBlock.moreTo" class="rel__more">查看专题 →</RouterLink>
      </div>
      <div class="rel__grid">
        <RouterLink v-for="t in relatedBlock.items" :key="t.meta.id" :to="`/tools/${t.meta.id}`" class="rel__item">
          <span class="rel__name">{{ t.meta.title }}</span>
          <span class="rel__desc">{{ t.meta.summary }}</span>
        </RouterLink>
      </div>
    </section>

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
.rel {
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border);
}
.rel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
}
.rel__title {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  font-weight: 600;
}
.rel__more {
  font-size: var(--fs-xs);
  color: var(--c-accent);
}
.rel__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-2);
}
.rel__item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: var(--radius-control-md);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  text-decoration: none;
  color: inherit;
  transition: background var(--dur-fast) var(--ease);
}
.rel__item:hover {
  background: var(--c-surface-3);
}
.rel__name {
  font-size: var(--fs-sm);
  font-weight: 600;
}
.rel__desc {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
