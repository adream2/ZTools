<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { download, formatBytes, resizeOne, type OutputFormat, type ResizedItem } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import Field from '@/components/ui/Field.vue'

const files = ref<File[]>([])
const items = ref<ResizedItem[]>([])
const busy = ref(false)
const error = ref('')

const maxEdge = ref('1600')
const format = ref<OutputFormat>('image/jpeg')
const quality = ref('85')
const square = ref(false)

const formatOptions = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG', value: 'image/png' },
  { label: 'WebP', value: 'image/webp' },
]

function clearItems(): void {
  items.value.forEach((i) => URL.revokeObjectURL(i.url))
  items.value = []
}

async function onFiles(list: File[]): Promise<void> {
  if (!list.length) return
  files.value = list.slice(0, 20)
  await run()
}

async function run(): Promise<void> {
  if (!files.value.length) return
  busy.value = true
  error.value = ''
  clearItems()

  const out: ResizedItem[] = []
  for (const file of files.value) {
    try {
      out.push(
        await resizeOne(file, {
          maxEdge: Number(maxEdge.value) || 0,
          format: format.value,
          quality: Number(quality.value) / 100,
          square: square.value,
        }),
      )
    } catch (e) {
      error.value = `${file.name}: ${e instanceof Error ? e.message : String(e)}`
    }
  }
  items.value = out
  busy.value = false
}

function saveAll(): void {
  if (!items.value.length) return
  items.value.forEach((item, i) => setTimeout(() => download(item.blob, item.name, format.value), i * 200))
}

function reset(): void {
  clearItems()
  files.value = []
  error.value = ''
}

onBeforeUnmount(clearItems)

const totalBefore = () => files.value.reduce((n, f) => n + f.size, 0)
const totalAfter = () => items.value.reduce((n, i) => n + i.blob.size, 0)
</script>

<template>
  <div class="rs">
    <FileDropZone
      v-if="!files.length"
      accept="image/*"
      multiple
      hint="选择多张图片（最多 20 张）"
      :max-size="30 * 1024 * 1024"
      @files="onFiles"
    />

    <template v-else>
      <div class="bar">
        <div class="bar__n">
          <Field label="最长边 px" hint="0 表示不缩放">
            <BaseInput v-model="maxEdge" type="number" mono />
          </Field>
        </div>
        <div class="bar__f">
          <Field label="格式">
            <BaseSelect v-model="format" :options="formatOptions" />
          </Field>
        </div>
        <div class="bar__n">
          <Field label="质量 %">
            <BaseInput v-model="quality" type="number" mono :disabled="format === 'image/png'" />
          </Field>
        </div>
        <label class="chk"><BaseSwitch v-model="square" /><span>裁成正方形</span></label>
        <BaseButton size="sm" :loading="busy" @click="run">重新处理</BaseButton>
        <span class="bar__gap" />
        <BaseButton size="sm" variant="primary" :disabled="!items.length" @click="saveAll">全部下载</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="reset">重选</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div v-if="items.length" class="summary">
        <span>{{ items.length }} 张</span>
        <span>原 {{ formatBytes(totalBefore()) }}</span>
        <span>处理后 {{ formatBytes(totalAfter()) }}</span>
      </div>

      <div class="grid">
        <div v-for="item in items" :key="item.name" class="item clay-card">
          <img :src="item.url" :alt="item.name" />
          <div class="item__meta">
            <span class="item__name">{{ item.name }}</span>
            <span class="item__size">{{ item.width }} × {{ item.height }} · {{ formatBytes(item.blob.size) }}</span>
          </div>
          <BaseButton size="sm" variant="ghost" @click="download(item.blob, item.name, format)">下载</BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.rs {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.bar__n {
  width: 104px;
}
.bar__f {
  width: 120px;
}
.bar__gap {
  flex: 1;
}
.chk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  padding-bottom: 10px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.summary {
  display: flex;
  gap: var(--sp-4);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--sp-2);
}
.item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--sp-2);
  border-radius: var(--radius-container-sm);
}
.item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-control-sm);
  background: var(--c-bg-subtle);
}
.item__meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.item__name {
  font-size: var(--fs-xs);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item__size {
  font-size: 10px;
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
</style>
