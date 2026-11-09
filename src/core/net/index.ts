import { ref } from 'vue'
import { allowNetwork } from '@/core/prefs'

export const online = ref(navigator.onLine)

window.addEventListener('online', () => (online.value = true))
window.addEventListener('offline', () => (online.value = false))

export const TIMEOUT_MS = 6000

export interface Source<T> {
  /** 展示给用户的数据来源名 */
  label: string
  url: string
  init?: RequestInit
  parse: (raw: unknown) => T
}

export interface FetchFirstResult<T> {
  data: T
  source: string
}

export class NetworkBlockedError extends Error {
  constructor(message = '当前处于离线状态，或已在设置中关闭了联网工具') {
    super(message)
    this.name = 'NetworkBlockedError'
  }
}

/**
 * 顺序尝试多个数据源，任一成功即返回；全部失败时把每个源的错误合并抛出。
 * 便于 UI 明确告诉用户「哪个源挂了、为什么」。
 */
export async function fetchFirst<T>(sources: Source<T>[], timeout = TIMEOUT_MS): Promise<FetchFirstResult<T>> {
  if (!navigator.onLine) throw new NetworkBlockedError()
  if (!allowNetwork.value) throw new NetworkBlockedError('已在设置中关闭联网工具，无法发起请求')

  const failures: string[] = []

  for (const source of sources) {
    try {
      const res = await fetch(source.url, {
        ...source.init,
        signal: AbortSignal.timeout(timeout),
        headers: { accept: 'application/json', ...(source.init?.headers ?? {}) },
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw: unknown = await res.json()
      return { data: source.parse(raw), source: source.label }
    } catch (err) {
      const reason = err instanceof DOMException && err.name === 'TimeoutError' ? '超时' : err instanceof Error ? err.message : String(err)
      failures.push(`${source.label}：${reason}`)
    }
  }

  throw new Error(`所有数据源均失败\n${failures.join('\n')}`)
}
