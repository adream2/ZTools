<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseSwitch from '../ui/BaseSwitch.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import CopyButton from '../ui/CopyButton.vue'
import Field from '../ui/Field.vue'
import EmptyState from '../ui/EmptyState.vue'
import { toastError } from '@/core/toast'
import type { GeneratorLogic } from './types'

const props = defineProps<{ logic: GeneratorLogic }>()

type Value = string | number | boolean
const values = reactive<Record<string, Value>>({})
const output = ref<string[]>([])
const pairs = ref<{ label: string; value: string }[]>([])
const error = ref('')

for (const f of props.logic.FIELDS) {
  values[f.key] = f.default ?? (f.type === 'switch' ? false : f.type === 'number' ? 1 : '')
}

const fieldOptions = computed(() =>
  Object.fromEntries(props.logic.FIELDS.filter((f) => f.options).map((f) => [f.key, f.options!])),
)

function run(): void {
  error.value = ''
  output.value = []
  pairs.value = []
  try {
    const result = props.logic.generate(values)
    if (typeof result === 'string') {
      output.value = result.split('\n')
    } else if (Array.isArray(result)) {
      if (result.length && typeof result[0] === 'string') {
        output.value = result as string[]
      } else {
        pairs.value = result as { label: string; value: string }[]
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    toastError(error.value)
  }
}

run()
</script>

<template>
  <div class="tmpl">
    <div class="fields">
      <template v-for="f in logic.FIELDS" :key="f.key">
        <div :class="['field', { 'field--wide': f.type === 'textarea' }]">
          <Field :label="f.label" :hint="f.hint">
            <BaseSelect
              v-if="f.type === 'select'"
              :model-value="String(values[f.key])"
              :options="fieldOptions[f.key] ?? []"
              @update:model-value="values[f.key] = $event"
            />
            <BaseSwitch
              v-else-if="f.type === 'switch'"
              :model-value="Boolean(values[f.key])"
              @update:model-value="values[f.key] = $event"
            />
            <BaseTextarea
              v-else-if="f.type === 'textarea'"
              :model-value="String(values[f.key])"
              :rows="3"
              @update:model-value="values[f.key] = $event"
            />
            <BaseInput
              v-else-if="f.type === 'number'"
              :model-value="String(values[f.key])"
              type="number"
              mono
              :placeholder="f.placeholder"
              @update:model-value="values[f.key] = Number($event)"
            />
            <BaseInput
              v-else
              :model-value="String(values[f.key])"
              :placeholder="f.placeholder"
              @update:model-value="values[f.key] = $event"
            />
          </Field>
        </div>
      </template>
    </div>

    <div class="actions">
      <BaseButton variant="primary" @click="run">生成</BaseButton>
      <span class="u-xs u-dim">{{ logic.note }}</span>
    </div>

    <div v-if="error" class="err">{{ error }}</div>

    <div v-if="output.length" class="result clay-list">
      <div class="result__bar">
        <span class="u-xs u-dim">{{ logic.resultLabel || '结果' }} · {{ output.length }} 项</span>
        <CopyButton :text="output.join('\n')" label="复制全部" />
      </div>
      <div class="rows">
        <div v-for="(line, i) in output" :key="i" class="row">
          <span class="row__idx">{{ i + 1 }}</span>
          <code class="row__text">{{ line }}</code>
          <CopyButton :text="line" label="" variant="ghost" />
        </div>
      </div>
    </div>

    <div v-else-if="pairs.length" class="pair-list clay-list">
      <div v-for="p in pairs" :key="p.label" class="pair">
        <span class="pair__k">{{ p.label }}</span>
        <code class="pair__v">{{ p.value }}</code>
        <CopyButton :text="p.value" label="" variant="ghost" />
      </div>
    </div>

    <EmptyState v-else-if="!error" text="点击「生成」得到结果" :icon="false" />
  </div>
</template>

<style scoped>
.tmpl {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sp-3);
}
.field--wide {
  grid-column: 1 / -1;
}
.actions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.result {
  overflow: hidden;
}
.result__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 12px;
  border-bottom: 1px solid var(--c-border);
}
.rows {
  max-height: 420px;
  overflow: auto;
}
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 7px 12px;
  border-bottom: 1px solid var(--c-border);
}
.row:last-child {
  border-bottom: none;
}
.row__idx {
  width: 22px;
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  text-align: right;
}
.row__text {
  flex: 1;
  font-size: var(--fs-sm);
  user-select: all;
  word-break: break-all;
}
.pair-list {
  overflow: hidden;
}
.pair {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-border);
}
.pair:last-child {
  border-bottom: none;
}
.pair__k {
  width: 120px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.pair__v {
  flex: 1;
  font-size: var(--fs-sm);
  user-select: all;
  word-break: break-all;
}
</style>
