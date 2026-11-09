<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div class="prose-page">
    <div class="prose-page__card clay-card">
      <header>
        <h1>{{ title }}</h1>
        <p v-if="subtitle" class="prose-page__sub">{{ subtitle }}</p>
      </header>
      <div class="prose">
        <slot />
      </div>
      <footer class="prose-page__foot">
        <RouterLink to="/">返回首页</RouterLink>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.prose-page {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-2) var(--sp-6);
}
.prose-page__card {
  padding: var(--sp-6) var(--sp-5);
  border-radius: var(--radius-container-lg);
}
h1 {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}
.prose-page__sub {
  margin-top: 6px;
  color: var(--c-text-2);
  font-size: var(--fs-md);
}
.prose {
  margin-top: var(--sp-5);
  font-size: var(--fs-md);
  color: var(--c-text-2);
  line-height: 1.8;
}
.prose :deep(h2) {
  font-size: var(--fs-md);
  color: var(--c-text);
  margin: var(--sp-5) 0 var(--sp-2);
}
.prose :deep(h3) {
  font-size: var(--fs-sm);
  color: var(--c-text);
  margin: var(--sp-4) 0 var(--sp-1);
}
.prose :deep(p) {
  margin-bottom: var(--sp-3);
}
.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.3em;
  margin-bottom: var(--sp-3);
}
.prose :deep(li) {
  margin-bottom: 4px;
}
.prose :deep(code) {
  background: var(--c-surface-2);
  border-radius: var(--radius-pill);
  padding: 1px 7px;
  font-size: 0.88em;
  color: var(--c-text);
}
.prose :deep(table) {
  font-size: var(--fs-sm);
  margin-bottom: var(--sp-3);
}
.prose :deep(th),
.prose :deep(td) {
  text-align: left;
  padding: 7px 10px;
  border-bottom: 1px solid var(--c-border);
}
.prose :deep(th) {
  color: var(--c-text);
  font-weight: 500;
}
.prose-page__foot {
  margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border);
  font-size: var(--fs-sm);
}
@media (max-width: 640px) {
  .prose-page__card {
    padding: var(--sp-4);
  }
}
</style>
