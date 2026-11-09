import { ref, watch } from 'vue'

const KEY_NETWORK = 'zt-allow-network'
const KEY_RECENT = 'zt-recent-tools'
const KEY_DENSITY = 'zt-compact'

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key)
    if (v === '1') return true
    if (v === '0') return false
  } catch {
    /* 忽略 */
  }
  return fallback
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* 忽略 */
  }
}

/** 联网工具总开关：关掉后所有需要外网请求的工具直接拒绝发起请求 */
export const allowNetwork = ref(readBool(KEY_NETWORK, true))
watch(allowNetwork, (v) => write(KEY_NETWORK, v ? '1' : '0'))

export const compactMode = ref(readBool(KEY_DENSITY, false))
watch(compactMode, (v) => write(KEY_DENSITY, v ? '1' : '0'))

export const recentTools = ref<string[]>(readRecent())

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(KEY_RECENT)
    const arr: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string').slice(0, 8) : []
  } catch {
    return []
  }
}

export function pushRecent(id: string): void {
  const next = [id, ...recentTools.value.filter((x) => x !== id)].slice(0, 8)
  recentTools.value = next
  write(KEY_RECENT, JSON.stringify(next))
}
