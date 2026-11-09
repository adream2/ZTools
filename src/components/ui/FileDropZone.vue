<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    hint?: string
    maxSize?: number
  }>(),
  { accept: '*/*', multiple: false, hint: '或点击选择文件', maxSize: 20 * 1024 * 1024 },
)

const emit = defineEmits<{ files: [File[]]; error: [string] }>()
const dragging = ref(false)
const input = ref<HTMLInputElement | null>(null)

function handle(list: FileList | null): void {
  if (!list?.length) return
  emit('files', Array.from(list))
}

function onChange(e: Event): void {
  const el = e.target as HTMLInputElement
  handle(el.files)
  el.value = ''
}

function onDrop(e: DragEvent): void {
  dragging.value = false
  handle(e.dataTransfer?.files ?? null)
}
</script>

<template>
  <div
    class="drop"
    :class="{ 'is-drag': dragging }"
    role="button"
    tabindex="0"
    @click="input?.click()"
    @keydown.enter.prevent="input?.click()"
    @keydown.space.prevent="input?.click()"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <span class="drop__icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
        <path d="M12 16V4m0 0L7 9m5-5 5 5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round" />
      </svg>
    </span>
    <div class="drop__text">
      拖拽文件到此处，<span class="drop__link">{{ hint }}</span>
    </div>
    <div class="drop__meta">最大 {{ Math.round(maxSize / 1024 / 1024) }} MB</div>
    <input ref="input" type="file" class="u-sr" :accept="accept" :multiple="multiple" @change="onChange" />
  </div>
</template>

<style scoped>
.drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: var(--sp-6) var(--sp-4);
  border-radius: var(--radius-container-md);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  color: var(--c-text-2);
  text-align: center;
  cursor: pointer;
  transition:
    box-shadow var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.drop:hover,
.drop.is-drag {
  color: var(--c-text);
  box-shadow:
    var(--clay-inset),
    0 0 0 2px color-mix(in srgb, var(--c-accent) 40%, transparent);
}
.drop__icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-control-md);
  color: var(--c-accent);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
}
.drop__text {
  font-size: var(--fs-md);
}
.drop__link {
  color: var(--c-accent);
}
.drop__meta {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
</style>
