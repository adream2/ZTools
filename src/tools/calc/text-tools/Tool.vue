<script setup lang="ts">
import { computed, ref } from 'vue'
import { OPS, applyOp, summary, type OpId } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'
import { toastOk } from '@/core/toast'

const input = ref('')
const output = ref('')
const lastOp = ref<OpId | null>(null)

const groups = computed(() => {
  const map = new Map<string, typeof OPS>()
  for (const op of OPS) {
    const list = map.get(op.group) ?? []
    list.push(op)
    map.set(op.group, list)
  }
  return [...map.entries()].map(([name, ops]) => ({ name, ops }))
})

const stats = computed(() => summary(input.value))
const outStats = computed(() => summary(output.value))

function run(op: OpId): void {
  output.value = applyOp(input.value, op)
  lastOp.value = op
}

function applyToInput(): void {
  if (!output.value) return
  input.value = output.value
  output.value = ''
  lastOp.value = null
  toastOk('已应用到输入，可继续处理')
}

function clearAll(): void {
  input.value = ''
  output.value = ''
  lastOp.value = null
}

const SAMPLE = `  Hello World  
  apple
banana

apple
中文，测试；全角！`
</script>

<template>
  <div class="tt">
    <div class="ops">
      <div v-for="g in groups" :key="g.name" class="ops__group">
        <span class="ops__name">{{ g.name }}</span>
        <div class="ops__list">
          <button
            v-for="op in g.ops"
            :key="op.id"
            type="button"
            :class="['op', { 'is-on': lastOp === op.id }]"
            :disabled="!input"
            @click="run(op.id)"
          >
            {{ op.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="bar">
      <span class="u-xs u-dim">{{ stats.lines }} 行 · {{ stats.chars }} 字符 · {{ stats.bytes }} 字节</span>
      <span class="bar__gap" />
      <BaseButton size="sm" variant="ghost" @click="input = SAMPLE">示例</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clearAll">清空</BaseButton>
    </div>

    <div class="split">
      <Field label="输入">
        <BaseTextarea v-model="input" :rows="16" placeholder="粘贴要处理的文本…" />
      </Field>
      <Field label="输出" :hint="output ? `${outStats.lines} 行 · ${outStats.chars} 字符` : ''">
        <div class="out">
          <div class="out__bar">
            <BaseButton size="sm" variant="ghost" :disabled="!output" @click="applyToInput">应用到输入</BaseButton>
            <CopyButton :text="output" />
          </div>
          <BaseTextarea v-model="output" :rows="16" readonly class="out__ta" placeholder="点击上方操作按钮" />
        </div>
      </Field>
    </div>

    <p class="tip">
      「应用到输入」可以把结果链式继续处理，例如先去重再排序再加行号。所有处理都是纯字符串操作，不联网。
    </p>
  </div>
</template>

<style scoped>
.tt {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.ops {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: var(--c-bg-subtle);
}
.ops__group {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.ops__name {
  width: 48px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.ops__list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.op {
  padding: 3px 9px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  font-size: var(--fs-xs);
  color: var(--c-text-2);
}
.op:hover:not(:disabled) {
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.op.is-on {
  background: var(--c-accent-weak);
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.op:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.bar__gap {
  flex: 1;
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 6px;
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.out__ta {
  border: none;
  border-radius: 0;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
@media (max-width: 640px) {
  .ops__group {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
