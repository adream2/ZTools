<script setup lang="ts">
import AppShell from './components/layout/AppShell.vue'
import ToastHost from './components/feedback/ToastHost.vue'
import UpdatePrompt from './components/feedback/UpdatePrompt.vue'
import OfflineBanner from './components/feedback/OfflineBanner.vue'
</script>

<template>
  <AppShell />
  <ToastHost />
  <UpdatePrompt />
  <OfflineBanner />
</template>
