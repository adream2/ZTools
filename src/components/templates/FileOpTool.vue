<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import BaseSwitch from '../ui/BaseSwitch.vue'
import CopyButton from '../ui/CopyButton.vue'
import EmptyState from '../ui/EmptyState.vue'
import Field from '../ui/Field.vue'
import FileDropZone from '../ui/FileDropZone.vue'
import { toastError, toastOk } from '@/core/toast'
import { formatBytes } from '@/tools/dev/hash/logic'
import type { FileOpLogic, FileOpOutput } from './types'

const props = defineProps<{ logic: FileOpLogic }>()

type Value = string | number | boolean
const files = ref<File[]>([])
const values = reactive<Record<string, Value>>({})
const results = ref<Array<{ output: FileOpOutput; url: string }>>([])
const busy = ref(false)
const error = ref('')

for (const f of props.logic.fields ?? []) {
  values[f.key] = f.default ?? (f.type === 'switch' ? false : f.type === 'number' ? 1 : '')
}

const fieldOptions = computed(() =>
  Object.fromEntries((props.logic.fields ?? []).filter((f) => f.options).map((f) => [f.key, f.options!])),
)
const totalSize = computed(() => files.value.reduce((sum, f) => sum + f.size, 0))
const canRun = computed(() => files.value.length > 0 && !busy.value)
const hasBlobs = computed(() => results.value.some((r) => r.output.blob))

function revokeAll(): void {
  for (const r of results.value) if (r.url) URL.revokeObjectURL(r.url)
  results.value = []
}

async function run(): Promise<void> {
  if (!files.value.length) return
  busy.value = true
  error.value = ''
  revokeAll()
  try {
    const list = await props.logic.run(files.value, values)
    results.value = list.map((output) => ({
      output,
      url: output.blob && output.blob.type.startsWith('image/') ? URL.createObjectURL(output.blob) : '',
    }))
    if (!list.length) error.value = '没有产生结果，检查一下参数'
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    toastError(error.value)
  } finally {
    busy.value = false
  }
}

function onFiles(list: File[]): void {
  revokeAll()
  error.value = ''
  files.value = props.logic.multiple ? list : list.slice(0, 1)
  if (props.logic.autoRun) void run()
}

function clearAll(): void {
  revokeAll()
  files.value = []
  error.value = ''
}

function save(entry: { output: FileOpOutput }): void {
  const blob = entry.output.blob
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = entry.output.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}

async function saveAll(): Promise<void> {
  for (const entry of results.value) {
    if (entry.output.blob) {
      save(entry)
      await new Promise((r) => setTimeout(r, 200))
    }
  }
  toastOk('已开始逐张下载')
}

const texts = computed(() => results.value.filter((r) => r.output.text))

onBeforeUnmount(revokeAll)
</script>

<template>
  <div class="fop">
    <FileDropZone
      v-if="!files.length"
      :accept="logic.accept"
      :multiple="logic.multiple"
      :hint="logic.dropHint || '选择文件'"
      :max-size="logic.maxSize ?? 20 * 1024 * 1024"
      @files="onFiles"
    />

    <template v-else>
      <div class="picked clay-card">
        <div class="picked__head">
          <span class="picked__title">{{ files.length }} 个文件 · {{ formatBytes(totalSize) }}</span>
          <button type="button" class="picked__clear" @click="clearAll">换一批</button>
        </div>
        <ul class="picked__list">
          <li v-for="f in files" :key="f.name + f.size">
            <span class="picked__name">{{ f.name }}</span>
            <span class="u-xs u-dim">{{ formatBytes(f.size) }}</span>
          </li>
        </ul>
      </div>

      <div v-if="logic.fields?.length" class="fields">
        <div v-for="f in logic.fields" :key="f.key" class="field">
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
            <BaseInput
              v-else
              :model-value="String(values[f.key])"
              :type="f.type === 'number' ? 'number' : f.type === 'color' ? 'color' : 'text'"
              :mono="f.type === 'number'"
              :placeholder="f.hint || ''"
              @update:model-value="values[f.key] = f.type === 'number' ? Number($event) : $event"
            />
          </Field>
        </div>
      </div>

      <div class="actions">
        <BaseButton variant="primary" :disabled="!canRun" @click="run">
          {{ busy ? '处理中…' : logic.actionLabel || '开始处理' }}
        </BaseButton>
        <BaseButton :disabled="!hasBlobs || busy" @click="saveAll">下载全部</BaseButton>
        <span v-if="logic.note" class="u-xs u-dim">{{ logic.note }}</span>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div v-if="results.length" class="grid">
        <figure v-for="(r, i) in results" :key="i" class="card clay-card">
          <div class="card__view">
            <img v-if="r.url" :src="r.url" :alt="r.output.name" />
            <pre v-else class="card__text">{{ r.output.text }}</pre>
          </div>
          <figcaption class="card__foot">
            <span class="card__name" :title="r.output.name">{{ r.output.name }}</span>
            <span class="card__meta">
              <span class="card__info u-xs u-dim">{{ r.output.meta || (r.output.blob ? formatBytes(r.output.blob.size) : '') }}</span>
              <span class="card__acts">
                <CopyButton v-if="r.output.text" :text="r.output.text" label="" variant="ghost" />
                <BaseButton v-if="r.output.blob" size="sm" variant="ghost" @click="save(r)">下载</BaseButton>
              </span>
            </span>
          </figcaption>
        </figure>
      </div>

      <EmptyState v-else-if="!error && !busy" :text="texts.length ? '处理完成' : '设置参数后点击处理'" :icon="false" />
    </template>
  </div>
</template>

<style scoped>
.fop {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.picked {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
}
.picked__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-border);
}
.picked__title {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.picked__clear {
  font-size: var(--fs-xs);
  color: var(--c-accent);
}
.picked__list {
  max-height: 140px;
  overflow: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}
.picked__list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: 6px 12px;
  border-bottom: 1px solid var(--c-border);
}
.picked__list li:last-child {
  border-bottom: none;
}
.picked__name {
  font-size: var(--fs-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: var(--sp-3);
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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--sp-3);
}
.card {
  margin: 0;
  border-radius: var(--radius-container-md);
  overflow: hidden;
}
.card__view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  background: var(--c-bg-subtle);
  background-image: linear-gradient(45deg, var(--c-border) 25%, transparent 25%, transparent 75%, var(--c-border) 75%),
    linear-gradient(45deg, var(--c-border) 25%, transparent 25%, transparent 75%, var(--c-border) 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.card__view img {
  display: block;
  width: 100%;
  max-height: 220px;
  object-fit: contain;
}
.card__text {
  width: 100%;
  margin: 0;
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--c-text);
  white-space: pre-wrap;
  word-break: break-all;
}
.card__foot {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 10px;
  border-top: 1px solid var(--c-border);
}
.card__name {
  font-size: var(--fs-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  min-width: 0;
}
.card__info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__acts {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: none;
}
</style>
