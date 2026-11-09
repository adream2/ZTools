<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import CopyButton from '../ui/CopyButton.vue'
import EmptyState from '../ui/EmptyState.vue'
import type { LookupLogic } from './types'

const props = defineProps<{ logic: LookupLogic }>()

const query = ref('')
const activeKey = ref<string | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.logic.DATASET.slice(0, 200)
  const keys = props.logic.searchKeys ?? ['title', 'desc', 'key']
  return props.logic.DATASET.filter((item) => {
    const hay = [item.title, item.desc ?? '', item.key, ...(item.tags ?? [])].join(' ').toLowerCase()
    return hay.includes(q) || keys.some((k) => String((item as unknown as Record<string, unknown>)[k] ?? '').toLowerCase().includes(q))
  }).slice(0, 200)
})

const active = computed(() => props.logic.DATASET.find((i) => i.key === activeKey.value) ?? filtered.value[0] ?? null)

function pick(key: string): void {
  activeKey.value = key
}
</script>

<template>
  <div class="tmpl">
    <div class="search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" stroke-linecap="round" />
      </svg>
      <BaseInput v-model="query" :placeholder="logic.placeholder || '搜索…'" />
      <span class="u-xs u-dim">{{ filtered.length }} / {{ logic.DATASET.length }}</span>
    </div>

    <div class="body">
      <div class="list clay-list">
        <button
          v-for="item in filtered"
          :key="item.key"
          type="button"
          :class="['item', { 'is-on': active?.key === item.key }]"
          @click="pick(item.key)"
        >
          <span class="item__title">{{ item.title }}</span>
          <span v-if="item.desc" class="item__desc">{{ item.desc }}</span>
        </button>
        <div v-if="!filtered.length" class="none">没有匹配项</div>
      </div>

      <div v-if="active" class="detail clay-card">
        <div class="detail__head">
          <h3>{{ active.title }}</h3>
          <CopyButton :text="active.rows?.map((r) => `${r.label}: ${r.value}`).join('\n') || active.title" label="" size="sm" variant="ghost" />
        </div>
        <p v-if="active.desc" class="detail__desc">{{ active.desc }}</p>
        <dl v-if="active.rows?.length" class="kv">
          <template v-for="r in active.rows" :key="r.label">
            <dt>{{ r.label }}</dt>
            <dd>{{ r.value }}</dd>
          </template>
        </dl>
        <div v-if="active.tags?.length" class="tags">
          <span v-for="t in active.tags" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>
      <EmptyState v-else text="选择左侧条目查看详情" :icon="false" />
    </div>

    <p v-if="logic.note" class="note">{{ logic.note }}</p>
  </div>
</template>

<style scoped>
.tmpl {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.search {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  color: var(--c-text-3);
}
.search :deep(input) {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  height: 34px;
  padding-left: 0;
}
.search :deep(input:focus) {
  box-shadow: none;
}
.body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: var(--sp-3);
  align-items: start;
}
.list {
  max-height: 460px;
  overflow: auto;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-border);
  text-align: left;
  color: var(--c-text);
  transition: background var(--dur-fast) var(--ease);
}
.item:last-child {
  border-bottom: none;
}
.item:hover {
  background: var(--c-bg-subtle);
}
.item.is-on {
  background: var(--c-accent-weak);
}
.item__title {
  font-size: var(--fs-sm);
  font-weight: 500;
}
.item__desc {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.none {
  padding: var(--sp-5);
  text-align: center;
  color: var(--c-text-3);
  font-size: var(--fs-sm);
}
.detail {
  padding: var(--sp-4);
  border-radius: var(--radius-container-md);
}
.detail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
}
.detail__head h3 {
  font-size: var(--fs-md);
}
.detail__desc {
  margin-top: 4px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.kv {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 0;
  margin-top: var(--sp-3);
  font-size: var(--fs-sm);
}
.kv dt,
.kv dd {
  padding: 6px 0;
  border-bottom: 1px solid var(--c-border);
}
.kv dt {
  color: var(--c-text-3);
  font-size: var(--fs-xs);
}
.kv dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  word-break: break-word;
}
.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: var(--sp-3);
}
.tag {
  font-size: var(--fs-2xs);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: var(--c-bg-subtle);
  color: var(--c-text-3);
}
.note {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
@media (max-width: 760px) {
  .body {
    grid-template-columns: minmax(0, 1fr);
  }
  .list {
    max-height: 280px;
  }
}
</style>
