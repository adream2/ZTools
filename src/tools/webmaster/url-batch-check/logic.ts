import { allowNetwork } from '@/core/prefs'

export interface CheckItem {
  url: string
  ok: boolean
  ms: number
  error?: string
}

const TIMEOUT = 8000

export function parseUrls(text: string): string[] {
  return text
    .split(/[\r\n,]+/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => (/^https?:\/\//i.test(l) ? l : `https://${l}`))
    .slice(0, 50)
}

async function checkOne(url: string): Promise<CheckItem> {
  const started = performance.now()
  try {
    await fetch(url, {
      mode: 'no-cors',
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(TIMEOUT),
    })
    return { url, ok: true, ms: Math.round(performance.now() - started) }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return {
      url,
      ok: false,
      ms: Math.round(performance.now() - started),
      error: message.includes('timeout') ? '超时' : '无法访问',
    }
  }
}

export async function checkAll(
  urls: string[],
  onProgress?: (done: number, total: number, item: CheckItem) => void,
): Promise<CheckItem[]> {
  if (!allowNetwork.value) throw new Error('已在设置中关闭联网工具')
  if (!navigator.onLine) throw new Error('当前处于离线状态')

  const out: CheckItem[] = []
  for (const url of urls) {
    const item = await checkOne(url)
    out.push(item)
    onProgress?.(out.length, urls.length, item)
  }
  return out
}

export function summaryOf(items: CheckItem[]): { total: number; ok: number; fail: number; avg: number } {
  const ok = items.filter((i) => i.ok)
  return {
    total: items.length,
    ok: ok.length,
    fail: items.length - ok.length,
    avg: ok.length ? Math.round(ok.reduce((n, i) => n + i.ms, 0) / ok.length) : 0,
  }
}
