<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { CATEGORIES_WITH_TOOLS } from '@/core/registry'
import { categoryTone } from '@/core/config'
import ClayIcon from '@/components/ui/ClayIcon.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AdSlot from '@/components/ads/AdSlot.vue'
const route = useRoute()

const cat = computed(() => CATEGORIES_WITH_TOOLS.find((c) => c.id === route.params.cat))

const grouped = computed(() => {
  const list = cat.value?.tools ?? []
  const map = new Map<string, typeof list>()
  for (const t of list) {
    const key = t.meta.subcategory || '全部'
    const arr = map.get(key) ?? []
    arr.push(t)
    map.set(key, arr)
  }
  return [...map.entries()].map(([name, tools]) => ({ name, tools }))
})
</script>

<template>
  <div v-if="cat" class="cat-page">
    <header class="head" :style="{ '--tone': categoryTone(cat.id) }">
      <ClayIcon :tone="categoryTone(cat.id)" :path="cat.icon" size="lg" />
      <div class="head__text">
        <h1>{{ cat.title }}</h1>
        <p>{{ cat.summary }} · {{ cat.tools.length }} 个工具</p>
      </div>
      <RouterLink to="/" class="head__back">← 首页</RouterLink>
    </header>

    <section v-for="g in grouped" :key="g.name" class="group">
      <h2 v-if="g.name !== '全部'" class="group__title">{{ g.name }}</h2>
      <div class="grid">
        <RouterLink
          v-for="t in g.tools"
          :key="t.meta.id"
          :to="`/tools/${t.meta.id}`"
          class="tool"
          :style="{ '--tone': categoryTone(cat.id) }"
        >
          <span class="tool__top">
            <span class="tool__title">{{ t.meta.title }}</span>
            <span v-if="t.meta.badge === 'limited'" class="tool__tag">受限</span>
            <span v-else-if="(t.meta.privacy ?? 'local') === 'network'" class="tool__tag tool__tag--net">联网</span>
          </span>
          <span class="tool__desc">{{ t.meta.summary }}</span>
        </RouterLink>
      </div>
    </section>

    <AdSlot placement="categoryBottom" :min-height="140" />
  </div>

  <EmptyState v-else text="分类不存在" hint="回到首页看看有哪些工具">
    <RouterLink to="/" class="back">返回首页</RouterLink>
  </EmptyState>
</template>

<style scoped>
.cat-page {
  max-width: 1024px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-2) var(--sp-6);
}
.head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-5);
  margin-bottom: var(--sp-4);
  border-radius: var(--radius-container-lg);
  background: linear-gradient(150deg, color-mix(in srgb, var(--tone) 12%, var(--c-surface)), var(--c-surface) 64%);
  box-shadow: var(--clay-raised);
}
.head__text {
  flex: 1;
  min-width: 0;
}
.head__text h1 {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}
.head__text p {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  margin-top: 2px;
}
.head__back {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
  flex: none;
}
.head__back:hover {
  color: var(--c-text);
}
.group {
  margin-bottom: var(--sp-4);
}
.group__title {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--c-text-3);
  letter-spacing: 0.06em;
  margin: 0 0 var(--sp-2) var(--sp-1);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(226px, 1fr));
  gap: var(--sp-2);
}
.tool {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 14px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface);
  color: var(--c-text);
  text-decoration: none;
  box-shadow: var(--clay-raised-sm);
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
}
.tool:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: var(--clay-raised);
}
.tool:active {
  transform: none;
  box-shadow: var(--clay-pressed);
}
.tool__top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.tool__title {
  font-size: var(--fs-md);
  font-weight: 500;
}
.tool__desc {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.5;
}
.tool__tag {
  font-size: 10px;
  padding: 0 5px;
  border-radius: 4px;
  color: var(--c-warn);
  background: var(--c-warn-weak);
  flex: none;
}
.tool__tag--net {
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
}
.back {
  font-size: var(--fs-sm);
}
@media (max-width: 640px) {
  .head {
    padding: var(--sp-4);
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
