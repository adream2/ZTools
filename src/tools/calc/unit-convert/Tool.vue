<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CATEGORIES, allConversions } from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const categoryId = ref('length')
const from = ref('m')
const raw = ref('1')

const category = computed(() => CATEGORIES.find((c) => c.id === categoryId.value) ?? CATEGORIES[0]!)

watch(categoryId, () => {
  from.value = category.value.units[0]?.id ?? ''
})

const unitOptions = computed(() => category.value.units.map((u) => ({ label: u.label, value: u.id })))

const results = computed(() => {
  const n = Number(raw.value)
  if (!raw.value.trim() || Number.isNaN(n)) return []
  return allConversions(n, from.value, categoryId.value).filter((r) => r.unit.id !== from.value)
})

const fromLabel = computed(() => category.value.units.find((u) => u.id === from.value)?.label ?? '')

function pick(unitId: string, value: string): void {
  from.value = unitId
  raw.value = value
}

const catTabs = computed(() =>
  CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
)
</script>

<template>
  <div class="uc">
    <div class="cats">
      <button
        v-for="c in catTabs"
        :key="c.id"
        type="button"
        :class="['cat', { 'is-on': categoryId === c.id }]"
        @click="categoryId = c.id"
      >
        {{ c.label }}
      </button>
    </div>

    <div class="bar">
      <div class="bar__val">
        <Field label="数值" :hint="fromLabel">
          <BaseInput v-model="raw" mono placeholder="1" />
        </Field>
      </div>
      <div class="bar__unit">
        <Field label="单位">
          <BaseSelect v-model="from" :options="unitOptions" />
        </Field>
      </div>
    </div>

    <div v-if="results.length" class="list">
      <button
        v-for="r in results"
        :key="r.unit.id"
        type="button"
        class="row"
        :title="`把 ${r.value} 设为输入`"
        @click="pick(r.unit.id, r.value)"
      >
        <span class="row__label">{{ r.unit.label }}</span>
        <code class="row__value">{{ r.value }}</code>
        <span class="row__copy" @click.stop>
          <CopyButton :text="r.value" label="" variant="ghost" />
        </span>
      </button>
    </div>
    <div v-else class="empty">输入数值后显示全部单位换算结果。点击任意一行可把它设为新的输入单位。</div>

    <p class="tip">
      温度换算使用标准公式（°F = °C × 9/5 + 32）；数据存储按 1024 进制（1 GB = 1024 MB），与操作系统显示口径一致。
    </p>
  </div>
</template>

<style scoped>
.uc {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.cats {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.cat {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border);
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.cat:hover {
  border-color: var(--c-border-strong);
  color: var(--c-text);
}
.cat.is-on {
  background: var(--c-accent-weak);
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);
}
.bar__val {
  flex: 1;
  min-width: 160px;
}
.bar__unit {
  flex: 0 0 180px;
}
.list {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  width: 100%;
  padding: 7px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
  text-align: left;
  color: var(--c-text);
  transition: background var(--dur-fast) var(--ease);
}
.row:last-child {
  border-bottom: none;
}
.row:hover {
  background: var(--c-bg-subtle);
}
.row__label {
  width: 150px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.row__value {
  flex: 1;
  font-size: var(--fs-md);
  font-family: var(--font-mono);
  word-break: break-all;
}
.row__copy {
  flex: none;
  opacity: 0.55;
}
.row:hover .row__copy {
  opacity: 1;
}
.empty {
  padding: var(--sp-4);
  border: 1px dashed var(--c-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  color: var(--c-text-3);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
