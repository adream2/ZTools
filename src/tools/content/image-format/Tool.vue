<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { download, formatBytes, resizeOne, type OutputFormat, type ResizedItem } from '@/tools/content/image-resize/logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import FileDropZone from '@/components/ui/FileDropZone.vue'
import Field from '@/components/ui/Field.vue'

const file = ref<File | null>(null)
const source = ref('')
const format = ref<OutputFormat>('image/webp')
const quality = ref('88')
const result = ref<ResizedItem | null>(null)
const busy = ref(false)
const error = ref('')

const formatOptions = [
  { label: 'WebP（体积最小）', value: 'image/webp' },
  { label: 'JPEG（兼容最好）', value: 'image/jpeg' },
  { label: 'PNG（无损，支持透明）', value: 'image/png' },
]

async function convert(): Promise<void> {
  if (!file.value) return
  busy.value = true
  error.value = ''
  try {
    if (result.value) URL.revokeObjectURL(result.value.url)
    result.value = await resizeOne(file.value, {
      maxEdge: 0,
      format: format.value,
      quality: Number(quality.value) / 100,
      square: false,
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

async function onFiles(files: File[]): Promise<void> {
  const f = files[0]
  if (!f) return
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
  file.value = f
  source.value = URL.createObjectURL(f)
  result.value = null
  await convert()
}

function save(): void {
  if (result.value && file.value) download(result.value.blob, file.value.name, format.value)
}

function reset(): void {
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
  file.value = null
  source.value = ''
  result.value = null
}

onBeforeUnmount(() => {
  if (source.value) URL.revokeObjectURL(source.value)
  if (result.value) URL.revokeObjectURL(result.value.url)
})
</script>

<template>
  <div class="fmt">
    <FileDropZone v-if="!file" accept="image/*" hint="选择图片" :max-size="30 * 1024 * 1024" @files="onFiles" />

    <template v-else>
      <div class="bar">
        <div class="bar__f">
          <Field label="目标格式">
            <BaseSelect v-model="format" :options="formatOptions" />
          </Field>
        </div>
        <div class="bar__n">
          <Field label="质量 %">
            <BaseInput v-model="quality" type="number" mono :disabled="format === 'image/png'" />
          </Field>
        </div>
        <BaseButton size="sm" :loading="busy" @click="convert">重新转换</BaseButton>
        <span class="bar__gap" />
        <BaseButton size="sm" variant="primary" :disabled="!result" @click="save">下载</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="reset">换一张</BaseButton>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="imgs">
        <figure class="img clay-card">
          <img :src="source" alt="原图" />
          <figcaption>原图 · {{ formatBytes(file.size) }}</figcaption>
        </figure>
        <figure v-if="result" class="img clay-card">
          <img :src="result.url" alt="转换后" />
          <figcaption>{{ result.width }} × {{ result.height }} · {{ formatBytes(result.blob.size) }}</figcaption>
        </figure>
      </div>

      <p v-if="result" class="delta">
        体积变化：
        <b :class="result.blob.size <= file.size ? 'is-ok' : 'is-bad'">
          {{ result.blob.size <= file.size ? '减少' : '增加' }}
          {{ Math.abs(Math.round((1 - result.blob.size / file.size) * 100)) }}%
        </b>
      </p>
    </template>
  </div>
</template>

<style scoped>
.fmt {
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
.bar__f {
  width: 200px;
}
.bar__n {
  width: 100px;
}
.bar__gap {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.imgs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
.img {
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-container-md);
}
.img img {
  width: 100%;
  height: 280px;
  object-fit: contain;
  background: var(--c-bg-subtle);
  display: block;
}
.img figcaption {
  padding: 7px 12px;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid var(--c-border);
}
.delta {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
}
.delta b {
  font-family: var(--font-mono);
}
.delta .is-ok {
  color: var(--c-ok);
}
.delta .is-bad {
  color: var(--c-danger);
}
@media (max-width: 760px) {
  .imgs {
    grid-template-columns: 1fr;
  }
}
</style>
