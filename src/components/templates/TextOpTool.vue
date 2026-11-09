<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import CopyButton from '../ui/CopyButton.vue'
import Field from '../ui/Field.vue'
import { toastOk } from '@/core/toast'
import type { TextOpLogic } from './types'

const props = defineProps<{ logic: TextOpLogic }>()

const input = ref('')
const output = ref('')
const activeOp = ref<string | null>(props.logic.OPS[0]?.id ?? null)

const groups = computed(() => {
  const map = new Map<string, { id: string; label: string }[]>()
  for (const op of props.logic.OPS) {
    const key = op.group ?? '操作'
    const arr = map.get(key) ?? []
    arr.push({ id: op.id, label: op.label })
    map.set(key, arr)
  }
  return [...map.entries()].map(([name, ops]) => ({ name, ops }))
})

const stats = computed(() => `${[...input.value].length} 字符 · ${input.value.split(/\r?\n/).length} 行`)

function run(op: string): void {
  activeOp.value = op
  if (!input.value) {
    output.value = ''
    return
  }
  try {
    output.value = props.logic.apply(input.value, op)
  } catch (e) {
    output.value = `转换失败：${e instanceof Error ? e.message : String(e)}`
  }
}

function chain(): void {
  if (!output.value) return
  input.value = output.value
  output.value = ''
  toastOk('已应用到输入，可继续处理')
}

function clearAll(): void {
  input.value = ''
  output.value = ''
}

if (props.logic.autoRun) {
  watch(input, () => {
    if (activeOp.value) run(activeOp.value)
  })
}
</script>

<template>
  <div class="tmpl">
    <div class="bar">
      <div v-for="g in groups" :key="g.name" class="bar__group">
        <span v-if="groups.length > 1" class="bar__name">{{ g.name }}</span>
        <div class="bar__ops">
          <button
            v-for="op in g.ops"
            :key="op.id"
            type="button"
            :class="['op', { 'is-on': activeOp === op.id }]"
            :disabled="!input"
            @click="run(op.id)"
          >
            {{ op.label }}
          </button>
        </div>
      </div>
      <span class="bar__gap" />
      <BaseButton v-if="logic.sample" size="sm" variant="ghost" @click="input = logic.sample!">示例</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clearAll">清空</BaseButton>
    </div>

    <div class="split">
      <Field :label="logic.inputLabel || '输入'">
        <BaseTextarea v-model="input" :rows="14" placeholder="在这里输入或粘贴内容…" />
      </Field>

      <Field :label="logic.outputLabel || '输出'" :hint="output ? `${output.length} 字符` : ''">
        <div class="out clay-list">
          <div class="out__bar">
            <BaseButton v-if="!logic.noChain" size="sm" variant="ghost" :disabled="!output" @click="chain">应用到输入</BaseButton>
            <span v-else />
            <CopyButton :text="output" />
          </div>
          <BaseTextarea v-model="output" :rows="14" readonly class="out__ta" placeholder="点击上方操作按钮" />
        </div>
      </Field>
    </div>

    <div class="foot">
      <span class="u-xs u-dim">{{ stats }}</span>
      <span v-if="logic.note" class="u-xs u-dim">· {{ logic.note }}</span>
    </div>
  </div>
</template>

<style scoped>
.tmpl {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.bar__group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bar__name {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  letter-spacing: 0.04em;
}
.bar__ops {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.bar__gap {
  flex: 1;
}
.op {
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  background: var(--c-surface);
  color: var(--c-text-2);
  font-size: var(--fs-sm);
  box-shadow: var(--clay-raised-sm);
  transition: all var(--dur-fast) var(--ease);
}
.op:hover:not(:disabled) {
  color: var(--c-text);
  transform: translateY(-1px);
  box-shadow: var(--clay-raised);
}
.op:active:not(:disabled) {
  transform: none;
  box-shadow: var(--clay-pressed);
}
.op.is-on {
  color: var(--c-accent);
  box-shadow:
    var(--clay-inset),
    inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 34%, transparent);
}
.op:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}
.out {
  overflow: hidden;
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 8px;
  border-bottom: 1px solid var(--c-border);
}
.out__ta {
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}
.out__ta:focus {
  box-shadow: none;
}
.foot {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
