import { allowNetwork } from '@/core/prefs'

export interface PingSample {
  index: number
  ok: boolean
  ms: number
  error?: string
}

export interface PingSummary {
  samples: PingSample[]
  success: number
  total: number
  min: number
  max: number
  avg: number
  jitter: number
}

const TIMEOUT = 8000

export function normalizeUrl(input: string): string {
  const raw = input.trim()
  if (!raw) throw new Error('请输入网址')
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(withScheme)
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') throw new Error()
    return url.toString()
  } catch {
    throw new Error('网址格式不正确')
  }
}

async function probe(url: string): Promise<{ ok: boolean; ms: number; error?: string }> {
  const started = performance.now()
  try {
    await fetch(url, {
      mode: 'no-cors',
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(TIMEOUT),
    })
    return { ok: true, ms: Math.round(performance.now() - started) }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, ms: Math.round(performance.now() - started), error: message.includes('timeout') ? '超时' : '失败' }
  }
}

export async function ping(
  input: string,
  count = 5,
  onProgress?: (done: number) => void,
): Promise<PingSummary> {
  if (!allowNetwork.value) throw new Error('已在设置中关闭联网工具')
  if (!navigator.onLine) throw new Error('当前处于离线状态')
  const url = normalizeUrl(input)

  const samples: PingSample[] = []
  for (let i = 0; i < count; i++) {
    const result = await probe(url)
    samples.push({ index: i + 1, ...result })
    onProgress?.(i + 1)
    if (i < count - 1) await new Promise((r) => setTimeout(r, 260))
  }

  const okSamples = samples.filter((s) => s.ok)
  const values = okSamples.map((s) => s.ms)
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
  const jitter = values.length > 1 ? values.reduce((a, b) => a + Math.abs(b - avg), 0) / values.length : 0

  return {
    samples,
    success: okSamples.length,
    total: count,
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
    avg: Math.round(avg),
    jitter: Math.round(jitter),
  }
}
