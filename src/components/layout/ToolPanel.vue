<script setup lang="ts">
import PrivacyBadge from '../ui/PrivacyBadge.vue'
import ClayIcon from '../ui/ClayIcon.vue'
import type { PrivacyLevel, ToolCategoryId } from '@/core/types'
import { CATEGORIES } from '@/core/config'

const props = withDefaults(
  defineProps<{
    title: string
    summary?: string
    privacy?: PrivacyLevel
    networkHosts?: string[]
    badge?: 'new' | 'beta' | 'limited'
    category?: ToolCategoryId
    tips?: string[]
  }>(),
  { privacy: 'local' },
)

const CAT_COLOR: Record<ToolCategoryId, string> = {
  dev: 'var(--c-cat-dev)',
  webmaster: 'var(--c-cat-webmaster)',
  content: 'var(--c-cat-content)',
  calc: 'var(--c-cat-calc)',
}

const cat = props.category ? CATEGORIES.find((c) => c.id === props.category) : undefined
const badgeText = { new: '新工具', beta: '测试中', limited: '功能受限' } as const
</script>

<template>
  <article class="panel clay-card">
    <header class="panel__head">
      <ClayIcon v-if="cat" :tone="CAT_COLOR[cat.id]" :path="cat.icon" size="lg" />
      <div class="panel__meta">
        <div class="panel__crumb">{{ cat?.title ?? '' }}</div>
        <div class="panel__title-row">
          <h1 class="panel__title">{{ title }}</h1>
          <PrivacyBadge :level="privacy" :hosts="networkHosts" />
          <span v-if="badge" :class="['panel__badge', `panel__badge--${badge}`]">{{ badgeText[badge] }}</span>
        </div>
        <p v-if="summary" class="panel__summary">{{ summary }}</p>
      </div>
    </header>
    <div class="panel__body">
      <slot />
    </div>

    <section v-if="tips?.length" class="panel__tips">
      <h2 class="panel__tips-title">使用提示</h2>
      <ul>
        <li v-for="(tip, i) in tips" :key="i">{{ tip }}</li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.panel {
  width: 100%;
  max-width: 1440px;
  min-height: 100%;
  margin: 0 auto;
  padding: var(--sp-5) var(--sp-5) var(--sp-6);
  border-radius: var(--radius-container-lg);
  display: flex;
  flex-direction: column;
}
.panel__head {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  margin-bottom: var(--sp-5);
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--c-border);
}
.panel__meta {
  min-width: 0;
}
.panel__crumb {
  font-size: 11px;
  color: var(--c-text-3);
  letter-spacing: 0.04em;
  margin-bottom: 3px;
  min-height: 13px;
}
.panel__title-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.panel__title {
  font-size: var(--fs-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
}
.panel__badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: var(--radius-pill);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
}
.panel__badge--limited {
  color: var(--c-warn);
  background: var(--c-warn-weak);
}
.panel__summary {
  margin-top: 5px;
  font-size: var(--fs-md);
  color: var(--c-text-2);
  max-width: 720px;
}
.panel__body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  min-width: 0;
  flex: 1;
}
.panel__tips {
  margin-top: var(--sp-6);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-border);
}
.panel__tips-title {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--sp-2);
}
.panel__tips ul {
  padding-left: 1.15em;
  display: grid;
  gap: 6px;
}
.panel__tips li {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  line-height: 1.7;
}
.panel__tips li::marker {
  color: var(--c-text-3);
}

@media (max-width: 640px) {
  .panel {
    padding: var(--sp-4) var(--sp-4) var(--sp-5);
  }
  .panel__head {
    gap: var(--sp-2);
  }
}
</style>
