<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import TopBar from './TopBar.vue'
import SideBar from './SideBar.vue'
import AppFooter from './AppFooter.vue'
import MobileDrawer from './MobileDrawer.vue'
import CommandPalette from '../search/CommandPalette.vue'
import { openPalette } from '@/core/ui-state'

function onKey(e: KeyboardEvent): void {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    openPalette()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="shell">
    <TopBar />
    <SideBar class="shell__side" />
    <main id="main" class="shell__main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <MobileDrawer />
    <CommandPalette />
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: var(--w-sidebar) minmax(0, 1fr);
  grid-template-rows: var(--h-topbar) minmax(0, 1fr) auto;
  gap: var(--shell-gap);
  height: 100%;
  padding: var(--shell-pad);
  background: transparent;
}
.shell__main {
  grid-column: 2;
  grid-row: 2;
  overflow: auto;
  overscroll-behavior: contain;
  border-radius: var(--radius-container-lg);
  padding: 6px;
  scroll-padding-top: var(--sp-4);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-fast) var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .shell {
    grid-template-columns: minmax(0, 1fr);
    padding: 10px;
    gap: 8px;
  }
  .shell__side {
    display: none;
  }
  .shell__main {
    grid-column: 1;
  }
}
</style>
