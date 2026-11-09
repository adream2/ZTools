<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import JsonWorker from './worker?worker'
import { useWorkerTask } from '@/core/worker/useWorkerTask'
import { highlightJson } from '@/core/json-highlight'
import {
  MAX_INPUT,
  WORKER_THRESHOLD,
  escapeJson,
  formatBytes,
  jsonStats,
  unescapeJson,
  type JsonStats,
} from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

interface JsonResult {
  output: string
  stats: JsonStats
}

const SAMPLE = `{"name":"ZT 工具箱","version":"0.1.0","local":true,"tools":[{"id":"json","ok":true},{"id":"hash","ok":true}],"meta":{"stars":null}}`

const input = ref('')
const output = ref('')
const indent = ref('2')
const sortKeys = ref(false)
const auto = ref(true)
const stats = ref<JsonStats | null>(null)

const { run, loading, error } = useWorkerTask<JsonResult>(() => new JsonWorker(), { timeout: 20000 })

const tooLarge = computed(() => input.value.length > MAX_INPUT)
const highlighted = computed(() => (output.value && output.value.length < WORKER_THRESHOLD ? highlightJson(output.value) : ''))

let timer: ReturnType<typeof setTimeout> | undefined

async function execute(action: 'format' | 'minify'): Promise<void> {
  if (!input.value.trim()) {
    output.value = ''
    stats.value = null
    return
  }
  if (tooLarge.value) return

  const res = await run('run', {
    text: input.value,
    action,
    options: { indent: indent.value === 'tab' ? '\t' : Number(indent.value), sortKeys: sortKeys.value },
  })
  if (res) {
    output.value = res.output
    stats.value = res.stats
  }
}

function scheduleAuto(): void {
  clearTimeout(timer)
  if (!auto.value || input.value.length > WORKER_THRESHOLD) return
  timer = setTimeout(() => void execute('format'), 420)
}

watch([input, indent, sortKeys], scheduleAuto)
onBeforeUnmount(() => clearTimeout(timer))

function loadSample(): void {
  input.value = SAMPLE
  void execute('format')
}

function clearAll(): void {
  input.value = ''
  output.value = ''
  stats.value = null
}

function escapeAll(): void {
  try {
    output.value = escapeJson(input.value)
    stats.value = jsonStats(JSON.stringify(input.value))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

function unescapeAll(): void {
  try {
    output.value = unescapeJson(input.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

const indentOptions = [
  { label: '2 空格', value: '2' },
  { label: '4 空格', value: '4' },
  { label: 'Tab', value: 'tab' },
]
</script>

<template>
  <div class="json-tool">
    <div class="toolbar">
      <BaseButton variant="primary" size="sm" :loading="loading" @click="execute('format')">格式化</BaseButton>
      <BaseButton size="sm" :loading="loading" @click="execute('minify')">压缩</BaseButton>
      <div class="toolbar__indent">
        <BaseSelect v-model="indent" :options="indentOptions" size="sm" />
      </div>
      <label class="toolbar__check">
        <BaseSwitch v-model="sortKeys" />
        <span>键名排序</span>
      </label>
      <label class="toolbar__check">
        <BaseSwitch v-model="auto" />
        <span>自动</span>
      </label>
      <span class="toolbar__gap" />
      <BaseButton size="sm" variant="ghost" @click="escapeAll">转义</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="unescapeAll">去转义</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="loadSample">示例</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="clearAll">清空</BaseButton>
    </div>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-if="tooLarge" class="err">输入超过 20 MB，请先拆分后再处理。</p>

    <div class="split">
      <Field label="输入">
        <BaseTextarea v-model="input" :rows="20" placeholder="粘贴 JSON…" :invalid="!!error" />
      </Field>

      <Field label="输出">
        <div class="out">
          <div class="out__bar">
            <span class="u-xs u-dim">{{ output ? `${formatBytes(output.length)} · ${output.split('\n').length} 行` : '结果会出现在这里' }}</span>
            <CopyButton :text="output" />
          </div>
          <pre v-if="highlighted" class="out__code" v-html="highlighted" />
          <pre v-else-if="output" class="out__code">{{ output }}</pre>
          <div v-else class="out__placeholder">尚无输出</div>
        </div>
      </Field>
    </div>

    <div v-if="stats" class="stats">
      <span>字节 <b>{{ formatBytes(stats.bytes) }}</b></span>
      <span>字符 <b>{{ stats.chars }}</b></span>
      <span>节点 <b>{{ stats.nodes }}</b></span>
      <span>最大深度 <b>{{ stats.depth }}</b></span>
      <span>对象 <b>{{ stats.objects }}</b></span>
      <span>数组 <b>{{ stats.arrays }}</b></span>
    </div>
  </div>
</template>

<style scoped>
.json-tool {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.toolbar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.toolbar__indent {
  width: 96px;
}
.toolbar__check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.toolbar__gap {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  white-space: pre-wrap;
  font-family: var(--font-mono);
  line-height: 1.5;
}
.out {
  display: flex;
  flex-direction: column;
  min-height: 424px;
  border-radius: var(--radius-container-sm);
  background: var(--c-code-bg);
  overflow: hidden;
  box-shadow: var(--clay-inset);
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 10px;
  border-bottom: 1px solid var(--c-border);
}
.out__code {
  margin: 0;
  padding: var(--sp-3);
  flex: 1;
  max-height: 460px;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-code);
  tab-size: 2;
  white-space: pre;
}
.out__placeholder {
  flex: 1;
  display: grid;
  place-items: center;
  padding: var(--sp-5);
  color: var(--c-text-3);
  font-size: var(--fs-sm);
}
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-4);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.stats b {
  color: var(--c-text-2);
  font-weight: 500;
  font-family: var(--font-mono);
}
.out__code :deep(.j-key) {
  color: var(--c-accent);
}
.out__code :deep(.j-str) {
  color: var(--c-ok);
}
.out__code :deep(.j-num) {
  color: #a254f5;
}
.out__code :deep(.j-bool) {
  color: var(--c-warn);
}
.out__code :deep(.j-null) {
  color: var(--c-text-3);
}
</style>
