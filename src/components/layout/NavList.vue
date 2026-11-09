<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CATEGORIES_WITH_TOOLS } from '@/core/registry'
import { drawerOpen } from '@/core/ui-state'
import { CATEGORIES } from '@/core/config'
import type { ToolCategoryId } from '@/core/types'

const route = useRoute()
const emit = defineEmits<{ navigate: [] }>()

const CAT_COLOR: Record<ToolCategoryId, string> = {
  dev: 'var(--c-cat-dev)',
  webmaster: 'var(--c-cat-webmaster)',
  content: 'var(--c-cat-content)',
  calc: 'var(--c-cat-calc)',
}

const open = ref<Record<string, boolean>>({})

function isOpen(id: string): boolean {
  const explicit = open.value[id]
  if (explicit !== undefined) return explicit
  // 默认展开：当前工具所属分类
  return route.params.id ? CATEGORIES_WITH_TOOLS.find((c) => c.tools.some((t) => t.meta.id === route.params.id))?.id === id : true
}

function toggle(id: string): void {
  open.value = { ...open.value, [id]: !isOpen(id) }
}

const activeId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))

function close(): void {
  drawerOpen.value = false
  emit('navigate')
}

const catTitle = (id: string) => CATEGORIES.find((c) => c.id === id)?.title ?? ''
</script>

<template>
  <nav class="nav" aria-label="工具分类">
    <section v-for="cat in CATEGORIES_WITH_TOOLS" :key="cat.id" class="nav__group">
      <button type="button" class="nav__cat" :class="{ 'is-collapsed': !isOpen(cat.id) }" @click="toggle(cat.id)">
        <span class="nav__dot" :style="{ background: CAT_COLOR[cat.id] }" aria-hidden="true" />
        <span class="nav__cat-name">{{ catTitle(cat.id) }}</span>
        <span class="nav__count">{{ cat.tools.length }}</span>
        <svg class="nav__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-show="isOpen(cat.id)" class="nav__items">
        <RouterLink
          v-for="tool in cat.tools"
          :key="tool.meta.id"
          :to="`/tools/${tool.meta.id}`"
          class="nav__item"
          :class="{ 'is-active': activeId === tool.meta.id }"
          @click="close"
        >
          <span class="u-truncate">{{ tool.meta.title }}</span>
          <span v-if="tool.meta.badge === 'limited'" class="nav__tag">受限</span>
          <span v-else-if="tool.meta.badge === 'new'" class="nav__tag nav__tag--new">新</span>
        </RouterLink>
      </div>
    </section>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav__group {
  padding: 2px 0;
}
.nav__cat {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border-radius: var(--radius-control-sm);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--c-text-2);
  letter-spacing: 0.02em;
  transition: background var(--dur-fast) var(--ease);
}
.nav__cat:hover {
  background: var(--c-bg-subtle);
}
.nav__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 8%, transparent);
}
.nav__cat-name {
  flex: 1;
  text-align: left;
}
.nav__count {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
  border-radius: var(--radius-pill);
  padding: 0 6px;
  line-height: 16px;
}
.nav__chev {
  color: var(--c-text-3);
  transition: transform var(--dur-fast) var(--ease);
  flex: none;
}
.nav__cat.is-collapsed .nav__chev {
  transform: rotate(-90deg);
}
.nav__items {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 2px 0 6px 6px;
}
.nav__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--radius-control-sm);
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
}
.nav__item:hover {
  background: var(--c-bg-subtle);
  color: var(--c-text);
  text-decoration: none;
}
.nav__item.is-active {
  background: var(--c-surface);
  color: var(--c-accent);
  font-weight: 500;
  box-shadow: var(--clay-raised-sm);
}
.nav__tag {
  flex: none;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 4px;
  color: var(--c-warn);
  background: var(--c-warn-weak);
}
.nav__tag--new {
  color: var(--c-ok);
  background: color-mix(in srgb, var(--c-ok) 12%, transparent);
}
</style>
