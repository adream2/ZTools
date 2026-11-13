<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseSwitch from '../ui/BaseSwitch.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import CopyButton from '../ui/CopyButton.vue'
import Field from '../ui/Field.vue'
import type { CalcLogic } from './types'

const props = defineProps<{ logic: CalcLogic }>()

type Value = string | number
const values = reactive<Record<string, Value>>({})

for (const f of props.logic.FIELDS) {
  values[f.key] = f.default ?? (f.type === 'switch' ? 0 : f.type === 'number' ? 0 : '')
}

const output = computed(() => {
  try {
    const result = props.logic.compute(values)
    return typeof result === 'string' ? [{ label: '结果', value: result, emphasis: true }] : result
  } catch (e) {
    return [{ label: '无法计算', value: e instanceof Error ? e.message : String(e), emphasis: false }]
  }
})

const optionsOf = (key: string) => props.logic.FIELDS.find((f) => f.key === key)?.options ?? []

const allText = computed(() => output.value.map((r) => `${r.label}: ${r.value}`).join('\n'))
</script>

<template>
  <div class="tmpl">
    <div class="fields">
      <div
        v-for="f in logic.FIELDS"
        :key="f.key"
        :class="['field', { 'field--wide': f.type === 'textarea' }, { 'field--switch': f.type === 'switch' }]"
      >
        <Field :label="f.label" :hint="f.hint">
          <BaseSelect
            v-if="f.type === 'select'"
            :model-value="String(values[f.key])"
            :options="optionsOf(f.key)"
            @update:model-value="values[f.key] = $event"
          />
          <BaseTextarea
            v-else-if="f.type === 'textarea'"
            :model-value="String(values[f.key])"
            :rows="5"
            @update:model-value="values[f.key] = $event"
          />
          <BaseSwitch
            v-else-if="f.type === 'switch'"
            :model-value="Boolean(values[f.key])"
            @update:model-value="values[f.key] = $event ? 1 : 0"
          />
          <BaseInput
            v-else
            :model-value="String(values[f.key])"
            :type="f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'"
            :mono="f.type === 'number'"
            :placeholder="f.type === 'date' ? '' : f.hint || ''"
            @update:model-value="values[f.key] = f.type === 'number' ? Number($event) : $event"
          />
        </Field>
      </div>
    </div>

    <div class="results">
      <div v-for="r in output" :key="r.label" :class="['res', { 'res--strong': r.emphasis }]">
        <span class="res__label">{{ r.label }}</span>
        <span class="res__value">{{ r.value }}</span>
        <span v-if="r.hint" class="res__hint">{{ r.hint }}</span>
      </div>
    </div>

    <div class="foot">
      <CopyButton :text="allText" label="复制结果" />
      <span v-if="logic.note" class="u-xs u-dim">{{ logic.note }}</span>
    </div>
  </div>
</template>

<style scoped>
.tmpl {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--sp-3);
}
.field--wide {
  grid-column: 1 / -1;
}
.field--switch :deep(.field__body) {
  display: flex;
  align-items: center;
  min-height: 40px;
}
.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-2);
}
.res {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 12px 14px;
  border-radius: var(--radius-container-sm);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
}
.res--strong {
  grid-column: 1 / -1;
  background: linear-gradient(150deg, var(--c-accent-weak), var(--c-surface) 70%);
  box-shadow: var(--clay-raised);
}
.res__label {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.res__value {
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: 600;
  letter-spacing: -0.01em;
  word-break: break-all;
}
.res--strong .res__value {
  font-size: var(--fs-xl);
  color: var(--c-accent);
}
.res__hint {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.foot {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
</style>
