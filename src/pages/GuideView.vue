<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { GUIDES_SORTED, getGuide } from '@/content/guides'
import { getTool } from '@/core/registry'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps<{ slug: string }>()

marked.setOptions({ gfm: true, breaks: false })

const guide = computed(() => getGuide(props.slug))

const html = computed(() => {
  if (!guide.value) return ''
  return DOMPurify.sanitize(marked.parse(guide.value.body, { async: false }) as string, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
  })
})

const related = computed(() =>
  (guide.value?.tools ?? [])
    .map((id) => getTool(id))
    .filter((x): x is NonNullable<typeof x> => !!x),
)

const index = computed(() => GUIDES_SORTED.findIndex((g) => g.slug === props.slug))
const prev = computed(() => (index.value > 0 ? GUIDES_SORTED[index.value - 1] : null))
const next = computed(() => (index.value >= 0 && index.value < GUIDES_SORTED.length - 1 ? GUIDES_SORTED[index.value + 1] : null))
</script>

<template>
  <div v-if="guide" class="guide">
    <nav class="crumb">
      <RouterLink to="/guides">使用指南</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="u-truncate">{{ guide.title }}</span>
    </nav>

    <article class="card">
      <header class="head">
        <h1>{{ guide.title }}</h1>
        <div class="head__meta">
          <span>{{ guide.date }}</span>
          <span v-for="t in guide.tags" :key="t" class="tag">{{ t }}</span>
        </div>
        <p class="head__summary">{{ guide.summary }}</p>
      </header>

      <div class="prose" v-html="html" />

      <section v-if="related.length" class="related">
        <h2>文中提到的工具</h2>
        <div class="related__grid">
          <RouterLink v-for="t in related" :key="t.meta.id" :to="`/tools/${t.meta.id}`" class="tool">
            <span class="tool__title">{{ t.meta.title }}</span>
            <span class="tool__desc">{{ t.meta.summary }}</span>
          </RouterLink>
        </div>
      </section>

      <nav v-if="prev || next" class="pager">
        <RouterLink v-if="prev" :to="`/guides/${prev.slug}`" class="pager__item">
          <span class="pager__dir">← 上一篇</span>
          <span class="pager__title">{{ prev.title }}</span>
        </RouterLink>
        <span v-else />
        <RouterLink v-if="next" :to="`/guides/${next.slug}`" class="pager__item pager__item--right">
          <span class="pager__dir">下一篇 →</span>
          <span class="pager__title">{{ next.title }}</span>
        </RouterLink>
      </nav>
    </article>
  </div>

  <EmptyState v-else text="文章不存在" hint="可能已经改名或删除">
    <RouterLink to="/guides" class="u-sm">返回使用指南</RouterLink>
  </EmptyState>
</template>

<style scoped>
.guide {
  max-width: 820px;
  margin: 0 auto;
  padding: var(--sp-3) var(--sp-3) var(--sp-6);
}
.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  min-width: 0;
}
.crumb a {
  color: var(--c-text-3);
  flex: none;
}
.crumb a:hover {
  color: var(--c-accent);
}
.card {
  padding: var(--sp-6) var(--sp-5);
  border-radius: var(--radius-container-lg);
  background: var(--c-surface);
  box-shadow: var(--clay-raised);
}
.head h1 {
  font-size: 26px;
  letter-spacing: -0.02em;
  line-height: 1.35;
}
.head__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.tag {
  padding: 1px 8px;
  border-radius: var(--radius-pill);
  background: var(--c-bg-subtle);
}
.head__summary {
  margin-top: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-left: 3px solid color-mix(in srgb, var(--c-accent) 40%, transparent);
  background: color-mix(in srgb, var(--c-accent) 5%, transparent);
  border-radius: 0 var(--radius-control-sm) var(--radius-control-sm) 0;
  font-size: var(--fs-md);
  color: var(--c-text-2);
  line-height: 1.75;
}
.prose {
  margin-top: var(--sp-5);
  font-size: 15px;
  color: var(--c-text-2);
  line-height: 1.9;
}
.prose :deep(h2) {
  font-size: 19px;
  color: var(--c-text);
  margin: var(--sp-5) 0 var(--sp-2);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--c-border);
}
.prose :deep(h3) {
  font-size: 16px;
  color: var(--c-text);
  margin: var(--sp-4) 0 var(--sp-1);
}
.prose :deep(p) {
  margin-bottom: var(--sp-3);
}
.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.4em;
  margin-bottom: var(--sp-3);
}
.prose :deep(li) {
  margin-bottom: 5px;
}
.prose :deep(strong) {
  color: var(--c-text);
  font-weight: 600;
}
.prose :deep(code) {
  background: var(--c-surface-2);
  border-radius: var(--radius-pill);
  padding: 1px 7px;
  font-size: 0.88em;
  color: var(--c-text);
}
.prose :deep(pre) {
  background: var(--c-surface-2);
  border-radius: var(--radius-container-sm);
  padding: var(--sp-3) var(--sp-4);
  overflow: auto;
  margin-bottom: var(--sp-3);
  box-shadow: var(--clay-inset);
}
.prose :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: 13px;
  line-height: 1.7;
}
.prose :deep(table) {
  width: 100%;
  margin-bottom: var(--sp-3);
  font-size: var(--fs-sm);
}
.prose :deep(th),
.prose :deep(td) {
  padding: 7px 10px;
  border-bottom: 1px solid var(--c-border);
  text-align: left;
}
.prose :deep(th) {
  color: var(--c-text);
  font-weight: 600;
  background: var(--c-bg-subtle);
}
.prose :deep(a) {
  color: var(--c-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.prose :deep(blockquote) {
  margin: 0 0 var(--sp-3);
  padding-left: 14px;
  border-left: 3px solid var(--c-border-strong);
  color: var(--c-text-3);
}
.prose :deep(hr) {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: var(--sp-5) 0;
}
.related {
  margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border);
}
.related h2 {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
  letter-spacing: 0.04em;
  margin-bottom: var(--sp-3);
}
.related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--sp-2);
}
.tool {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 11px 14px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
  color: var(--c-text);
  text-decoration: none;
  transition: all var(--dur-fast) var(--ease);
}
.tool:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: var(--clay-raised);
}
.tool__title {
  font-size: var(--fs-sm);
  font-weight: 500;
}
.tool__desc {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.pager {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-3);
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border);
}
.pager__item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 48%;
  text-decoration: none;
}
.pager__item--right {
  text-align: right;
  margin-left: auto;
}
.pager__dir {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.pager__title {
  font-size: var(--fs-sm);
  color: var(--c-text);
  line-height: 1.5;
}
.pager__item:hover .pager__title {
  color: var(--c-accent);
}
@media (max-width: 640px) {
  .guide {
    padding: var(--sp-2) var(--sp-2) var(--sp-5);
  }
  .card {
    padding: var(--sp-4);
  }
  .head h1 {
    font-size: 21px;
  }
  .prose {
    font-size: 14.5px;
  }
}
</style>
