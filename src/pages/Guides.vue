<script setup lang="ts">
import { GUIDES_SORTED } from '@/content/guides'
import ClayIcon from '@/components/ui/ClayIcon.vue'
</script>

<template>
  <div class="guides">
    <header class="head">
      <ClayIcon tone="var(--c-accent)" path="M4 5h11a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z M17 7h3v12H10" size="lg" />
      <div>
        <h1>使用指南</h1>
        <p class="head__sub">把工具的用法讲清楚：常见错误怎么定位、参数怎么选、什么时候该换别的方案。</p>
      </div>
    </header>

    <div class="list">
      <RouterLink v-for="g in GUIDES_SORTED" :key="g.slug" :to="`/guides/${g.slug}`" class="card">
        <div class="card__top">
          <span class="card__date">{{ g.date }}</span>
          <span v-for="t in g.tags" :key="t" class="card__tag">{{ t }}</span>
        </div>
        <h2 class="card__title">{{ g.title }}</h2>
        <p class="card__summary">{{ g.summary }}</p>
        <span class="card__more">阅读全文 →</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.guides {
  max-width: 880px;
  margin: 0 auto;
  padding: var(--sp-3) var(--sp-3) var(--sp-6);
}
.head {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-5);
  margin-bottom: var(--sp-4);
  border-radius: var(--radius-container-lg);
  background: linear-gradient(150deg, color-mix(in srgb, var(--c-accent) 9%, var(--c-surface)), var(--c-surface) 66%);
  box-shadow: var(--clay-raised);
}
.head h1 {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}
.head__sub {
  margin-top: 4px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  max-width: 560px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-container-md);
  background: var(--c-surface);
  color: var(--c-text);
  text-decoration: none;
  box-shadow: var(--clay-raised-sm);
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
}
.card:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: var(--clay-raised);
}
.card__top {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.card__date {
  font-family: var(--font-mono);
}
.card__tag {
  padding: 1px 8px;
  border-radius: var(--radius-pill);
  background: var(--c-bg-subtle);
}
.card__title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.4;
}
.card__summary {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  line-height: 1.65;
}
.card__more {
  margin-top: 2px;
  font-size: var(--fs-xs);
  color: var(--c-accent);
}
@media (max-width: 640px) {
  .guides {
    padding: var(--sp-2) var(--sp-2) var(--sp-5);
  }
  .head {
    padding: var(--sp-4);
  }
  .card {
    padding: var(--sp-3) var(--sp-4);
  }
}
</style>
