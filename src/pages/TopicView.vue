<script setup lang="ts">
import { computed } from 'vue'
import { TOPICS, getTopic } from '@/content/topics'
import { getGuide } from '@/content/guides'
import { getTool } from '@/core/registry'
import ClayIcon from '@/components/ui/ClayIcon.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps<{ id: string }>()

const topic = computed(() => getTopic(props.id))

const tools = computed(() =>
  (topic.value?.tools ?? []).map((id) => getTool(id)).filter((t): t is NonNullable<typeof t> => !!t),
)

const guides = computed(() =>
  (topic.value?.guides ?? []).map((slug) => getGuide(slug)).filter((g): g is NonNullable<typeof g> => !!g),
)

const others = computed(() => TOPICS.filter((t) => t.id !== props.id))

const paragraphs = computed(() => (topic.value?.intro ?? '').split('\n\n').filter(Boolean))
</script>

<template>
  <div v-if="topic" class="topic" :style="{ '--tone': topic.tone }">
    <nav class="crumb">
      <RouterLink to="/topics">专题</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="u-truncate">{{ topic.title }}</span>
    </nav>

    <header class="head">
      <ClayIcon :tone="topic.tone" :path="topic.icon" size="lg" />
      <div class="head__text">
        <h1>{{ topic.title }}</h1>
        <p>{{ topic.summary }} · {{ tools.length }} 个工具</p>
      </div>
    </header>

    <div class="intro clay-card">
      <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
    </div>

    <section class="section">
      <h2 class="section__title">按顺序使用</h2>
      <ol class="tools">
        <li v-for="(t, i) in tools" :key="t.meta.id">
          <RouterLink :to="`/tools/${t.meta.id}`" class="tool">
            <span class="tool__idx">{{ i + 1 }}</span>
            <span class="tool__body">
              <span class="tool__title">{{ t.meta.title }}</span>
              <span class="tool__desc">{{ t.meta.summary }}</span>
            </span>
          </RouterLink>
        </li>
      </ol>
    </section>

    <section v-if="guides.length" class="section">
      <h2 class="section__title">相关指南</h2>
      <ul class="guides">
        <li v-for="g in guides" :key="g.slug">
          <RouterLink :to="`/guides/${g.slug}`" class="guide">
            <strong>{{ g.title }}</strong>
            <span>{{ g.summary }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="section">
      <h2 class="section__title">其他专题</h2>
      <div class="others">
        <RouterLink v-for="t in others" :key="t.id" :to="`/topics/${t.id}`" class="other">
          <span class="other__dot" :style="{ background: t.tone }" aria-hidden="true" />
          {{ t.title }}
        </RouterLink>
      </div>
    </section>
  </div>

  <EmptyState v-else text="专题不存在" hint="看看还有哪些专题">
    <RouterLink to="/topics" class="back">返回专题列表</RouterLink>
  </EmptyState>
</template>

<style scoped>
.topic {
  max-width: 880px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-2) var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.crumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.crumb a {
  color: var(--c-text-2);
}
.head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.head__text h1 {
  font-size: var(--fs-2xl);
}
.head__text p {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.intro {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-container-md);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.intro p {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  line-height: 1.8;
}
.section__title {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
  margin-bottom: var(--sp-2);
  font-weight: 600;
}
.tools {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  counter-reset: t;
}
.tool {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: 10px 12px;
  border-radius: var(--radius-control-md);
  background: var(--c-surface-2);
  text-decoration: none;
  color: inherit;
  transition: background var(--dur-fast) var(--ease);
}
.tool:hover {
  background: var(--c-surface-3);
}
.tool__idx {
  flex: none;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-full);
  background: var(--tone);
  color: var(--c-on-accent);
  font-size: var(--fs-2xs);
  font-family: var(--font-mono);
}
.tool__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.tool__title {
  font-size: var(--fs-sm);
  font-weight: 600;
}
.tool__desc {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.guides {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.guide {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-control-md);
  background: var(--c-surface-2);
  text-decoration: none;
  color: inherit;
}
.guide strong {
  font-size: var(--fs-sm);
}
.guide span {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.others {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.other {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--c-surface-2);
  font-size: var(--fs-xs);
  color: var(--c-text-2);
  text-decoration: none;
}
.other__dot {
  width: 7px;
  height: 7px;
  border-radius: var(--radius-full);
}
.back {
  color: var(--c-accent);
  font-size: var(--fs-sm);
}
</style>
