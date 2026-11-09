import { ref, computed, watch } from 'vue'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'zt-theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

function read(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* 隐私模式忽略 */
  }
  return 'system'
}

export const themeMode = ref<ThemeMode>(read())
export const systemDark = ref(media.matches)

media.addEventListener('change', (e) => {
  systemDark.value = e.matches
})

export const isDark = computed(() => themeMode.value === 'dark' || (themeMode.value === 'system' && systemDark.value))

watch(
  isDark,
  (dark) => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#101115' : '#2f6bff')
  },
  { immediate: true },
)

watch(themeMode, (mode) => {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* 忽略 */
  }
})

export function setTheme(mode: ThemeMode): void {
  themeMode.value = mode
}

export function cycleTheme(): void {
  themeMode.value = themeMode.value === 'system' ? 'light' : themeMode.value === 'light' ? 'dark' : 'system'
}

export const THEME_LABEL: Record<ThemeMode, string> = {
  system: '跟随系统',
  light: '浅色',
  dark: '深色',
}
