import type { CalcLogic, CalcResult } from '@/components/templates/types'

export function parseUrl(input: string) {
  const raw = input.trim()
  if (!raw) throw new Error('请输入 URL')
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
  const u = new URL(withScheme)

  const params = [...u.searchParams.entries()]
  return {
    protocol: u.protocol.replace(':', ''),
    host: u.hostname,
    port: u.port || (u.protocol === 'https:' ? '443' : '80'),
    path: u.pathname,
    query: u.search.replace(/^\?/, ''),
    hash: u.hash.replace(/^#/, ''),
    origin: u.origin,
    params,
    isIp: /^\d{1,3}(\.\d{1,3}){3}$/.test(u.hostname),
    tld: u.hostname.split('.').slice(-1)[0] ?? '',
  }
}

const FIELDS = [{ key: 'url', label: 'URL', type: 'text' as const, default: 'https://example.com/blog/post?id=42&tag=zt#comments' }]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.url ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入 URL', emphasis: true }]
  const p = parseUrl(raw)

  const rows: CalcResult[] = [
    { label: '主机', value: p.host, emphasis: true, hint: p.isIp ? '直接使用 IP' : `.${p.tld} 域名` },
    { label: '协议', value: p.protocol },
    { label: '端口', value: p.port },
    { label: '路径', value: p.path || '/' },
    { label: '来源', value: p.origin },
  ]

  if (p.query) rows.push({ label: '查询串', value: p.query })
  if (p.hash) rows.push({ label: '锚点', value: p.hash })
  if (p.params.length) {
    rows.push({ label: `参数（${p.params.length}）`, value: p.params.map(([k, v]) => `${k}=${v}`).join('\n') })
  }
  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '不带协议时按 https 解析；参数会保留原始编码',
}

export default logic
