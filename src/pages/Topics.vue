<script setup lang="ts">
import { TOPICS } from '@/content/topics'
import ClayIcon from '@/components/ui/ClayIcon.vue'
</script>

<template>
  <div class="topics">
    <header class="head">
      <h1>专题</h1>
      <p class="head__sub">按使用场景把工具串起来：从哪一步开始、下一步用哪个，省得在 200 多个工具里翻。</p>
    </header>

    <div class="grid">
      <RouterLink
        v-for="t in TOPICS"
        :key="t.id"
        :to="`/topics/${t.id}`"
        class="card clay-card"
        :style="{ '--tone': t.tone }"
      >
        <ClayIcon :tone="t.tone" :path="t.icon" />
        <div class="card__body">
          <h2 class="card__title">{{ t.title }}</h2>
          <p class="card__desc">{{ t.summary }}</p>
          <span class="card__meta">{{ t.tools.length }} 个工具{{ t.guides?.length ? ` · ${t.guides.length} 篇指南` : '' }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.topics {
  max-width: 1024px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-2) var(--sp-6);
}
.head h1 {
  font-size: var(--fs-2xl);
  margin-bottom: 6px;
}
.head__sub {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  max-width: 640px;
  margin-bottom: var(--sp-4);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--sp-3);
}
.card {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-3);
  border-radius: var(--radius-container-md);
  text-decoration: none;
  color: inherit;
  transition: transform var(--dur-fast) var(--ease);
}
.card:hover {
  transform: translateY(-2px);
}
.card__body {
  min-width: 0;
}
.card__title {
  font-size: var(--fs-lg);
  margin-bottom: 4px;
}
.card__desc {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  margin-bottom: 8px;
}
.card__meta {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
</style>
