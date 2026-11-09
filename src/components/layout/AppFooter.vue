<script setup lang="ts">
import { CATEGORIES_WITH_TOOLS } from '@/core/registry'

const version = __APP_VERSION__.split('+')[0]
</script>

<template>
  <footer class="foot">
    <nav class="foot__links" aria-label="站点信息">
      <RouterLink to="/guides">使用指南</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/about">关于</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/privacy">隐私说明</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/terms">服务条款</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/contact">联系</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/settings">设置</RouterLink>
    </nav>

    <nav class="foot__cats" aria-label="分类导航">
      <RouterLink v-for="c in CATEGORIES_WITH_TOOLS" :key="c.id" :to="`/c/${c.id}`">{{ c.title }}</RouterLink>
    </nav>

    <div class="foot__meta">
      <span>纯静态 · 无后端 · 数据不出浏览器</span>
      <span class="foot__ver">v{{ version }}</span>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  grid-column: 1 / -1;
  grid-row: 3;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: 0 var(--sp-3);
  min-height: 42px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid color-mix(in srgb, var(--c-border) 80%, transparent);
}
.foot__links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
.foot__links a {
  color: var(--c-text-2);
}
.foot__sep {
  opacity: 0.5;
}
.foot__cats {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex: none;
  padding-left: var(--sp-3);
  border-left: 1px solid var(--c-border);
}
.foot__cats a {
  color: var(--c-text-3);
}
.foot__links a:hover,
.foot__cats a:hover {
  color: var(--c-accent);
}
.foot__meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-size: var(--fs-2xs);
}
.foot__ver {
  font-family: var(--font-mono);
}

@media (max-width: 900px) {
  .foot {
    padding: 8px var(--sp-3);
    min-height: 0;
    flex-wrap: wrap;
    gap: 6px 12px;
  }
  .foot__cats {
    border-left: none;
    padding-left: 0;
    font-size: 11px;
  }
  .foot__meta {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}
@media (max-width: 640px) {
  .foot__cats {
    display: none;
  }
}
@media (max-width: 520px) {
  .foot__meta span:first-child {
    display: none;
  }
}
</style>
