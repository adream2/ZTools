<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import DiffWorker from './worker?worker'
import { MAX_INPUT, changeRatio, type DiffResult } from './logic'
import { useWorkerTask } from '@/core/worker/useWorkerTask'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import Field from '@/components/ui/Field.vue'

const before = ref('')
const after = ref('')
const mode = ref('line')
const result = ref<DiffResult | null>(null)

const tabs = [
  { id: 'line', label: '行级' },
  { id: 'word', label: '词级' },
]

const { run, loading, error } = useWorkerTask<DiffResult>(() => new DiffWorker(), { timeout: 15000 })

const tooBig = computed(() => before.value.length > MAX_INPUT || after.value.length > MAX_INPUT)
const ratio = computed(() => (result.value ? changeRatio(result.value) : 0))

let timer: ReturnType<typeof setTimeout> | undefined
let runId = 0

async function execute(): Promise<void> {
  if (!before.value && !after.value) {
    result.value = null
    return
  }
  if (tooBig.value) return

  const id = ++runId
  const out = await run('run', { before: before.value, after: after.value, mode: mode.value })
  if (id === runId) result.value = out
}

function schedule(): void {
  clearTimeout(timer)
  timer = setTimeout(() => void execute(), 450)
}

watch([before, after, mode], schedule)
onBeforeUnmount(() => clearTimeout(timer))

function swap(): void {
  const tmp = before.value
  before.value = after.value
  after.value = tmp
}

function clearAll(): void {
  before.value = ''
  after.value = ''
  result.value = null
}
</script>

<template>
  <div class="diff">
    <div class="bar">
      <BaseTabs v-model="mode" :tabs="tabs" />
      <BaseButton size="sm" variant="ghost" @click="swap">交换</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clearAll">清空</BaseButton>
      <span class="bar__gap" />
      <span class="u-xs u-dim">
        {{ loading ? '对比中…' : result ? `差异 ${ratio}%` : '—' }}
        <template v-if="result?.mode === 'line'">
          · <span class="c-add">+{{ result.added }}</span>
          <span class="c-del">−{{ result.removed }}</span>
        </template>
      </span>
    </div>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-if="tooBig" class="err">文本超过 4 MB，请先裁剪。</p>

    <div class="split">
      <Field label="原始文本">
        <BaseTextarea v-model="before" :rows="9" placeholder="粘贴原始内容…" />
      </Field>
      <Field label="修改后">
        <BaseTextarea v-model="after" :rows="9" placeholder="粘贴修改后的内容…" />
      </Field>
    </div>

    <div v-if="result" class="out">
      <div class="out__head">对比结果</div>

      <div v-if="result.mode === 'line'" class="lines">
        <div v-for="(l, i) in result.lines" :key="i" :class="['line', `line--${l.kind}`]">
          <span class="line__no">{{ l.before ?? '' }}</span>
          <span class="line__no">{{ l.after ?? '' }}</span>
          <span class="line__sign">{{ l.kind === 'add' ? '+' : l.kind === 'del' ? '−' : ' ' }}</span>
          <code class="line__text">{{ l.text || ' ' }}</code>
        </div>
      </div>

      <pre v-else class="words"><template v-for="(f, i) in result.fragments" :key="i"><del v-if="f.kind === 'del'" class="frag-del">{{ f.text }}</del><ins v-else-if="f.kind === 'add'" class="frag-add">{{ f.text }}</ins><template v-else>{{ f.text }}</template></template></pre>
    </div>
  </div>
</template>

<style scoped>
.diff {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.bar__gap {
  flex: 1;
}
.c-add {
  color: var(--c-ok);
  margin-left: 4px;
}
.c-del {
  color: var(--c-danger);
  margin-left: 4px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.out__head {
  padding: 4px 10px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.lines {
  max-height: 420px;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-code);
}
.line {
  display: flex;
  gap: 0;
  white-space: pre;
  padding: 0 10px 0 0;
}
.line--add {
  background: color-mix(in srgb, var(--c-ok) 12%, transparent);
}
.line--del {
  background: color-mix(in srgb, var(--c-danger) 10%, transparent);
}
.line__no {
  width: 42px;
  flex: none;
  text-align: right;
  padding-right: 8px;
  color: var(--c-text-3);
  font-size: 11px;
  user-select: none;
}
.line__sign {
  width: 16px;
  flex: none;
  color: var(--c-text-3);
  user-select: none;
}
.line--add .line__sign {
  color: var(--c-ok);
}
.line--del .line__sign {
  color: var(--c-danger);
}
.line__text {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  word-break: break-all;
  white-space: pre-wrap;
}
.words {
  margin: 0;
  padding: var(--sp-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 420px;
  overflow: auto;
}
.frag-del {
  background: color-mix(in srgb, var(--c-danger) 18%, transparent);
  color: var(--c-danger);
  text-decoration: line-through;
}
.frag-add {
  background: color-mix(in srgb, var(--c-ok) 18%, transparent);
  color: var(--c-ok);
  text-decoration: none;
}
</style>
