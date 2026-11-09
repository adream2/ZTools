<script setup lang="ts">
import NavList from './NavList.vue'
</script>

<template>
  <aside class="side clay-card">
    <div class="side__scroll">
      <NavList />
    </div>
  </aside>
</template>

<style scoped>
.side {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: var(--radius-container-lg);
  overflow: hidden;
}
.side__scroll {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--sp-3) var(--sp-2) var(--sp-3);
}
</style>
