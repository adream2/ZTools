<script setup lang="ts">
import { watch } from 'vue'
import NavList from './NavList.vue'
import { drawerOpen } from '@/core/ui-state'

watch(drawerOpen, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="drawerOpen" class="drawer" @click.self="drawerOpen = false">
        <aside class="drawer__panel">
          <header class="drawer__head">
            <span>全部工具</span>
            <button type="button" aria-label="关闭" @click="drawerOpen = false">×</button>
          </header>
          <div class="drawer__scroll">
            <NavList @navigate="drawerOpen = false" />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--c-overlay);
  backdrop-filter: blur(2px);
  display: flex;
  padding: 8px;
}
.drawer__panel {
  width: 80vw;
  max-width: 300px;
  height: 100%;
  background: var(--c-surface);
  border-radius: var(--radius-container-lg);
  box-shadow: var(--shadow-2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4) var(--sp-4) var(--sp-3);
  font-size: var(--fs-sm);
  font-weight: 600;
  flex: none;
}
.drawer__head button {
  font-size: 20px;
  line-height: 1;
  color: var(--c-text-3);
  width: 30px;
  height: 30px;
  border-radius: var(--radius-control-sm);
}
.drawer__head button:hover {
  color: var(--c-text);
  background: var(--c-bg-subtle);
}
.drawer__scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--sp-2) var(--sp-3);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--dur-base) var(--ease);
}
.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel {
  transition: transform var(--dur-base) var(--ease);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer__panel,
.drawer-leave-to .drawer__panel {
  transform: translateX(-104%);
}
</style>
