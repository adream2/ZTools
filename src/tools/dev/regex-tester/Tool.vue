<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import RegexWorker from './worker?worker'
import { FLAGS, toSegments, type MatchInfo, type RegexResult } from './logic'
import { useWorkerTask } from '@/core/worker/useWorkerTask'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import Field from '@/components/ui/Field.vue'

const pattern = ref('\\b\\w+@\\w+\\.\\w+\\b')
const flags = ref('gi')
const text = ref('联系 admin@example.com 或 support@zt.dev，无效地址 a@b。')
const result = ref<RegexResult | null>(null)
const limit = 500

const { run, loading, error, cancel } = useWorkerTask<RegexResult>(() => new RegexWorker(), { timeout: 3000 })

const segments = computed(() => (result.value ? toSegments(text.value, result.value.matches) : []))
const shown = computed(() => result.value?.matches.slice(0, 50) ?? [])

let timer: ReturnType<typeof setTimeout> | undefined
let runId = 0

function toggleFlag(id: string): void {
  flags.value = flags.value.includes(id) ? flags.value.replace(id, '') : flags.value + id
  schedule()
}

async function execute(): Promise<void> {
  if (!pattern.value) {
    result.value = null
    return
  }
  const id = ++runId
  const out = await run('run', { pattern: pattern.value, flags: flags.value, text: text.value, limit })
  if (id !== runId) return
  result.value = out
}

function schedule(): void {
  clearTimeout(timer)
  timer = setTimeout(() => void execute(), 350)
}

watch([pattern, flags, text], schedule)
onBeforeUnmount(() => {
  clearTimeout(timer)
  cancel()
})

function groupText(m: MatchInfo): string {
  const parts: string[] = []
  m.groups.forEach((g, i) => {
    if (g !== undefined) parts.push(`$${i + 1}=${g}`)
  })
  if (m.named) for (const [k, v] of Object.entries(m.named)) parts.push(`${k}=${v}`)
  return parts.join('  ')
}

schedule()
</script>

<template>
  <div class="rx">
    <div class="pattern">
      <span class="pattern__slash">/</span>
      <BaseInput v-model="pattern" mono placeholder="正则表达式" class="pattern__in" />
      <span class="pattern__slash">/</span>
      <span class="pattern__flags">{{ flags }}</span>
    </div>

    <div class="flags">
      <button
        v-for="f in FLAGS"
        :key="f.id"
        type="button"
        :class="['flag', { 'is-on': flags.includes(f.id) }]"
        :title="f.hint"
        @click="toggleFlag(f.id)"
      >
        {{ f.label }}
      </button>
      <span class="flags__gap" />
      <span class="u-xs u-dim">{{ loading ? '匹配中…' : result ? `${result.matches.length} 处匹配 · ${result.duration} ms` : '—' }}</span>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <Field label="测试文本">
      <BaseTextarea v-model="text" :rows="6" />
    </Field>

    <div class="out">
      <div class="out__head">高亮结果</div>
      <pre class="out__body"><template v-for="(s, i) in segments" :key="i"><mark v-if="s.match" class="hit">{{ s.text }}</mark><template v-else>{{ s.text }}</template></template></pre>
    </div>

    <div v-if="shown.length" class="matches">
      <div class="matches__head">
        匹配详情
        <span v-if="result && result.matches.length > shown.length" class="u-dim">（仅显示前 {{ shown.length }} 条）</span>
        <span v-if="result?.truncated" class="u-dim">· 已截断</span>
      </div>
      <div v-for="(m, i) in shown" :key="i" class="match">
        <span class="match__idx">{{ i + 1 }}</span>
        <code class="match__text">{{ m.text || '(空匹配)' }}</code>
        <span class="match__pos">@{{ m.index }}</span>
        <code v-if="groupText(m)" class="match__groups">{{ groupText(m) }}</code>
      </div>
    </div>

    <p class="tip">
      正则跑在独立线程里，超过 3 秒会强制终止，防止 <code>(a+)+$</code> 这类灾难性回溯把页面卡死。
    </p>
  </div>
</template>

<style scoped>
.rx {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.pattern {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px 0 10px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-code-bg);
}
.pattern__slash {
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.pattern__in {
  border: none;
  background: transparent;
  box-shadow: none;
}
.pattern__in:focus {
  box-shadow: none;
}
.pattern__flags {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--c-accent);
  padding-right: 6px;
  min-width: 18px;
}
.flags {
  display: flex;
  align-items: center;
  gap: 4px;
}
.flags__gap {
  flex: 1;
}
.flag {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--c-text-3);
  border: 1px solid var(--c-border);
}
.flag:hover {
  color: var(--c-text);
}
.flag.is-on {
  color: var(--c-accent);
  border-color: var(--c-accent);
  background: var(--c-accent-weak);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  background: var(--c-code-bg);
  box-shadow: var(--clay-inset);
}
.out__head {
  padding: 4px 10px;
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
}
.out__body {
  margin: 0;
  padding: var(--sp-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-code);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 260px;
  overflow: auto;
}
.hit {
  background: color-mix(in srgb, var(--c-accent) 26%, transparent);
  color: var(--c-text);
  border-radius: 2px;
  outline: 1px solid color-mix(in srgb, var(--c-accent) 45%, transparent);
}
.matches {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.matches__head {
  padding: 6px 10px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.match {
  display: flex;
  align-items: baseline;
  gap: var(--sp-2);
  padding: 5px 10px;
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-xs);
}
.match:last-child {
  border-bottom: none;
}
.match__idx {
  width: 20px;
  flex: none;
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.match__text {
  color: var(--c-text);
  word-break: break-all;
}
.match__pos {
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.match__groups {
  color: var(--c-text-2);
  word-break: break-all;
  margin-left: auto;
  text-align: right;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
.tip code {
  background: var(--c-bg-subtle);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
