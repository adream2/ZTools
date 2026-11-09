import { allowNetwork } from '@/core/prefs'

export interface ProbeResult {
  input: string
  finalUrl: string
  ok: boolean
  status: number
  statusText: string
  elapsed: number
  https: boolean
  headers: { key: string; value: string }[]
  readable: boolean
  note: string
}

const TIMEOUT = 8000

export function normalizeUrl(input: string): string {
  let raw = input.trim()
  if (!raw) throw new Error('请输入网址')
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
  try {
    const u = new URL(raw)
    if (!u.hostname.includes('.') && u.hostname !== 'localhost') throw new Error()
    return u.toString()
  } catch {
    throw new Error('网址格式不正确')
  }
}

export async function probe(input: string): Promise<ProbeResult> {
  if (!allowNetwork.value) throw new Error('已在设置中关闭联网工具')
  const url = normalizeUrl(input)
  const started = performance.now()

  // 第一轮：正常 CORS 请求，能读到状态码和响应头
  try {
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      signal: AbortSignal.timeout(TIMEOUT),
      redirect: 'follow',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      headers: { accept: '*/*', 'cache-control': 'no-cache' },
    })
    return {
      input,
      finalUrl: res.url || url,
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      elapsed: Math.round(performance.now() - started),
      https: res.url.startsWith('https:'),
      headers: [...res.headers.entries()].map(([key, value]) => ({ key, value })),
      readable: true,
      note: '目标站点允许跨域，已读到完整响应头。',
    }
  } catch {
    // 第二轮：no-cors，只能确认「连得上」，读不到任何头
    try {
      await fetch(url, {
        mode: 'no-cors',
        signal: AbortSignal.timeout(TIMEOUT),
        redirect: 'follow',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
      })
      return {
        input,
        finalUrl: url,
        ok: true,
        status: 0,
        statusText: '无法读取（opaque）',
        elapsed: Math.round(performance.now() - started),
        https: url.startsWith('https:'),
        headers: [],
        readable: false,
        note: '目标站点未开启 CORS，浏览器只允许确认「可连通」，状态码与响应头被安全策略屏蔽。',
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      const timeout = message.includes('timeout') || message.includes('aborted')
      return {
        input,
        finalUrl: url,
        ok: false,
        status: 0,
        statusText: timeout ? '超时' : '无法连接',
        elapsed: Math.round(performance.now() - started),
        https: url.startsWith('https:'),
        headers: [],
        readable: false,
        note: timeout
          ? '请求超过 8 秒未响应，或目标站点阻止了跨域请求。'
          : `连接失败：${message}。可能是域名不存在、证书异常，或对方拦截了浏览器跨域请求。`,
      }
    }
  }
}

export function tlsInfo(url: string): string {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' ? 'HTTPS（证书由浏览器校验）' : 'HTTP（明文传输）'
  } catch {
    return '—'
  }
}
