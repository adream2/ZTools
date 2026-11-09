import { ref } from 'vue'

export const paletteOpen = ref(false)
export const drawerOpen = ref(false)

export function openPalette(): void {
  paletteOpen.value = true
}
