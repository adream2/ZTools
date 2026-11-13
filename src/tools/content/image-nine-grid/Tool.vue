<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { splitNine, type Tile } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import { formatBytes } from '@/tools/dev/hash/logic'
import { toastError } from '@/core/toast'

const file = ref<File | null>(null)
const source = ref('')
const tiles = ref<Tile[]>([])
const tileSize = ref(0)
const format = ref<'image/jpeg' | 'image/png'>('image/jpeg')
const busy = ref(false)
const error = ref('')

const formatOptions = [
  { label: 'JPEG（体积小）', value: 'image/jpeg' },
  { label: 'PNG（无损）', value: 'image/png' },
]

function revokeTiles(): void {
  for (const t of tiles.value) URL.revokeObjectURL(t.url)
  tiles.value = []
}

async function run(f: File, mime: 'image/jpeg' | 'image/png'): Promise<void> {
  busy.value = true
  error.value = ''
  revokeTiles()
  try {
    const result = await splitNine(f, mime)
    tiles.value = result.tiles
    tileSize.value = result.tileSize
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    toastError(error.value)
  } finally {
    busy.value = false
  }
}

async function onFiles(files: File[]): Promise<void> {
  const f = files[0]
  if (!f) return
  if (source.value) URL.revokeObjectURL(source.value)
  file.value = f
  source.value = URL.createObjectURL(f)
  await run(f, format.value)
}

async function changeFormat(): Promise<void> {
  if (file.value) await run(file.value, format.value)
}

function saveOne(tile: Tile): void {
  const a = document.createElement('a')
  a.href = tile.url
  a.download = `grid-${tile.index}.${format.value === 'image/png' ? 'png' : 'jpg'}`
  a.click()
}

async function saveAll(): Promise<void> {
  for (const tile of tiles.value) {
    saveOne(tile)
    await new Promise((r) => setTimeout(r, 180))
  }
}

function clearAll(): void {
  if (source.value) URL.revokeObjectURL(source.value)
  revokeTiles()
  file.value = null
  source.value = ''
  error.value = ''
}

onBeforeUnmount(() => {
  if (source.value) URL.revokeObjectURL(source.value)
  revokeTiles()
})
</script>

<template>
  <div class="nine">
    <FileDropZone v-if="!file" accept="image/*" hint="选择一张图片，或拖进来" :max-size="20 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="bar">
        <div class="bar__fmt">
          <BaseSelect :model-value="format" :options="formatOptions" size="sm" @update:model-value="format = $event as 'image/jpeg' | 'image/png'; changeFormat()" />
        </div>
        <BaseButton size="sm" variant="primary" :disabled="busy || !tiles.length" @click="saveAll">下载全部 9 张</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="clearAll">换一张</BaseButton>
        <span class="bar__gap" />
        <span class="u-xs u-dim">每张 {{ tileSize }} × {{ tileSize }} px</span>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="grid">
        <div v-for="tile in tiles" :key="tile.index" class="cell clay-card">
          <img :src="tile.url" :alt="`第 ${tile.index} 张`" />
          <div class="cell__foot">
            <span class="cell__idx">{{ tile.index }}</span>
            <span class="u-xs u-dim">{{ formatBytes(tile.blob.size) }}</span>
            <BaseButton size="sm" variant="ghost" @click="saveOne(tile)">下载</BaseButton>
          </div>
        </div>
      </div>

      <figure class="origin clay-card">
        <img :src="source" alt="原图" />
        <figcaption>原图 · 居中裁成正方形后切分</figcaption>
      </figure>
    </template>
  </div>
</template>

<style scoped>
.nine {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__gap {
  flex: 1;
}
.bar__fmt {
  width: 170px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
}
.cell {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
}
.cell img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: var(--c-bg-subtle);
}
.cell__foot {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 4px 8px;
  border-top: 1px solid var(--c-border);
}
.cell__idx {
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  color: var(--c-accent);
}
.origin {
  margin: 0;
  border-radius: var(--radius-container-md);
  overflow: hidden;
}
.origin img {
  display: block;
  width: 100%;
  max-height: 240px;
  object-fit: contain;
  background: var(--c-bg-subtle);
}
.origin figcaption {
  padding: 7px 12px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid var(--c-border);
}
@media (max-width: 640px) {
  .bar__fmt {
    width: 100%;
  }
}
</style>
