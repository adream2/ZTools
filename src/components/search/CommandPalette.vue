<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { paletteOpen } from '@/core/ui-state'
import { highlight, searchAll, type SearchHit } from '@/core/search'
import { CATEGORIES_WITH_TOOLS } from '@/core/registry'
import { categoryTitle } from '@/core/config'

const router = useRouter()
const query = ref('')
const cursor = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)

/** 空查询时展示各分类的前几个工具，作为入口 */
const DEFAULT_HITS: SearchHit[] = CATEGORIES_WITH_TOOLS.flatMap((c) =>
  c.tools.slice(0, 4).map((tool) => ({
    kind: 'tool' as const,
    id: tool.meta.id,
    title: tool.meta.title,
    summary: tool.meta.summary,
    label: categoryTitle(c.id),
    to: `/tools/${tool.meta.id}`,
    score: 0,
  })),
)

const results = computed(() => (query.value.trim() ? searchAll(query.value, 14) : DEFAULT_HITS))

watch(paletteOpen, async (open) => {
  if (open) {
    query.value = ''
    cursor.value = 0
    await nextTick()
    inputEl.value?.focus()
  }
})

watch(query, () => (cursor.value = 0))

function close(): void {
  paletteOpen.value = false
}

function go(index: number): void {
  const hit = results.value[index]
  if (!hit) return
  close()
  void router.push(hit.to)
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') return close()
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    cursor.value = (cursor.value + 1) % Math.max(results.value.length, 1)
    scrollIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    cursor.value = (cursor.value - 1 + results.value.length) % Math.max(results.value.length, 1)
    scrollIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go(cursor.value)
  }
}

function scrollIntoView(): void {
  void nextTick(() => {
    const el = listEl.value?.querySelector<HTMLElement>(`[data-idx="${cursor.value}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="palette">
      <div v-if="paletteOpen" class="palette" @click.self="close">
        <div class="palette__panel" role="dialog" aria-modal="true" aria-label="搜索工具">
          <div class="palette__input-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" stroke-linecap="round" />
            </svg>
            <input
              ref="inputEl"
              v-model="query"
              class="palette__input"
              placeholder="搜索工具、专题、指南…"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKeydown"
            />
            <kbd>Esc</kbd>
          </div>

          <div ref="listEl" class="palette__list">
            <button
              v-for="(hit, i) in results"
              :key="`${hit.kind}-${hit.id}`"
              type="button"
              :data-idx="i"
              :class="['palette__item', { 'is-active': i === cursor }]"
              @mouseenter="cursor = i"
              @click="go(i)"
            >
              <span class="palette__icon" :class="`palette__icon--${hit.kind}`" aria-hidden="true">
                {{ hit.kind === 'tool' ? 'T' : hit.kind === 'topic' ? '专' : '文' }}
              </span>
              <span class="palette__item-main">
                <span class="palette__title" v-html="highlight(hit.title, query)" />
                <span class="palette__summary">{{ hit.summary }}</span>
              </span>
              <span class="palette__cat">{{ hit.label }}</span>
            </button>
            <div v-if="!results.length" class="palette__empty">没有匹配的内容，换个关键词试试</div>
          </div>

          <footer class="palette__foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
            <span><kbd>Enter</kbd> 打开</span>
            <span><kbd>Esc</kbd> 关闭</span>
            <span class="palette__count">{{ results.length }} 条结果</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  padding: 10vh var(--sp-4) var(--sp-4);
  background: var(--c-overlay);
  backdrop-filter: blur(3px);
}
.palette__panel {
  width: 100%;
  max-width: 580px;
  max-height: 68vh;
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
  border-radius: var(--radius-container-lg);
  box-shadow: var(--shadow-2), var(--clay-raised);
  overflow: hidden;
}
.palette__input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px;
  padding: 0 14px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  color: var(--c-text-3);
  flex: none;
}
.palette__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-md);
  color: var(--c-text);
}
.palette__list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 8px;
}
.palette__item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  width: 100%;
  padding: 9px 12px;
  border-radius: var(--radius-control-sm);
  text-align: left;
  color: var(--c-text);
  transition: all var(--dur-fast) var(--ease);
}
.palette__item.is-active {
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
}
.palette__item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.palette__title {
  font-size: var(--fs-md);
  font-weight: 500;
}
.palette__title :deep(mark) {
  background: transparent;
  color: var(--c-accent);
  font-weight: 600;
}
.palette__summary {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.palette__icon {
  flex: none;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--c-on-accent);
  background: var(--c-accent);
}
.palette__icon--topic {
  background: var(--c-cat-content);
}
.palette__icon--guide {
  background: var(--c-cat-calc);
}
.palette__cat {
  flex: none;
  font-size: 11px;
  color: var(--c-text-3);
  padding: 2px 9px;
  border-radius: var(--radius-pill);
  background: var(--c-bg-subtle);
}
.palette__empty {
  padding: var(--sp-5);
  text-align: center;
  color: var(--c-text-3);
  font-size: var(--fs-sm);
}
.palette__foot {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: 9px var(--sp-4);
  border-top: 1px solid var(--c-border);
  font-size: 11px;
  color: var(--c-text-3);
  flex: none;
}
.palette__foot kbd {
  font-size: 10px;
  padding: 1px 5px;
  margin-right: 3px;
  border-radius: 4px;
  background: var(--c-bg-subtle);
  color: var(--c-text-2);
}
.palette__count {
  margin-left: auto;
}
.palette-enter-active,
.palette-leave-active {
  transition: opacity var(--dur-fast) var(--ease);
}
.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}
</style>
