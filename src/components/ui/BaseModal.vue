<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const open = defineModel<boolean>('open', { default: false })
defineProps<{ title?: string; width?: string }>()

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape' && open.value) open.value = false
}

document.addEventListener('keydown', onKey)
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="open = false">
        <div class="modal__panel" role="dialog" aria-modal="true" :style="{ width: width || '540px' }">
          <header v-if="title" class="modal__head">
            <h2>{{ title }}</h2>
            <button type="button" class="modal__close" aria-label="关闭" @click="open = false">×</button>
          </header>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh var(--sp-4) var(--sp-4);
  background: rgb(28 30 44 / 42%);
  backdrop-filter: blur(3px);
}
.modal__panel {
  max-width: 100%;
  max-height: 76vh;
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
  border-radius: var(--radius-container-lg);
  box-shadow: var(--shadow-2), var(--clay-raised);
  overflow: hidden;
}
.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4) var(--sp-5);
  border-bottom: 1px solid var(--c-border);
}
.modal__close {
  font-size: 20px;
  line-height: 1;
  color: var(--c-text-3);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}
.modal__close:hover {
  color: var(--c-text);
  background: var(--c-bg-subtle);
}
.modal__body {
  padding: var(--sp-4) var(--sp-5);
  overflow: auto;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-base) var(--ease);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
