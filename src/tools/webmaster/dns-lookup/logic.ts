import { fetchFirst } from '@/core/net'

export const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'CAA', 'SRV', 'PTR'] as const
export type RecordType = (typeof RECORD_TYPES)[number]

const TYPE_NAMES: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  12: 'PTR',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  33: 'SRV',
  257: 'CAA',
  41: 'OPT',
  46: 'RRSIG',
  48: 'DNSKEY',
  43: 'DS',
}

export interface DnsAnswer {
  name: string
  type: string
  ttl: number
  data: string
}

export interface DnsResult {
  answers: DnsAnswer[]
  status: string
  source: string
  elapsed: number
}

interface DohResponse {
  Status?: number
  Answer?: { name?: string; type?: number; TTL?: number; data?: string }[]
  Authority?: { name?: string; type?: number; TTL?: number; data?: string }[]
}

const STATUS_TEXT: Record<number, string> = {
  0: 'NOERROR 查询成功',
  1: 'FORMERR 格式错误',
  2: 'SERVFAIL 解析失败',
  3: 'NXDOMAIN 域名不存在',
  5: 'REFUSED 被拒绝',
}

function parseDoh(raw: unknown): { answers: DnsAnswer[]; status: string } {
  const d = raw as DohResponse
  const code = d.Status ?? 0
  const list = [...(d.Answer ?? []), ...(d.Authority ?? [])]

  const answers: DnsAnswer[] = list.map((a) => ({
    name: a.name ?? '',
    type: TYPE_NAMES[a.type ?? 0] ?? String(a.type ?? ''),
    ttl: a.TTL ?? 0,
    data: a.data ?? '',
  }))

  return { answers, status: STATUS_TEXT[code] ?? `状态码 ${code}` }
}

export function validateDomain(input: string): string {
  const q = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
  if (!q) throw new Error('请输入域名')
  if (!/^([\w-]+\.)+[\w-]{2,}$/.test(q) && !/^(\d{1,3}\.){3}\d{1,3}$/.test(q)) {
    throw new Error('域名格式不正确')
  }
  return q
}

export async function queryDns(domain: string, type: RecordType): Promise<DnsResult> {
  const started = performance.now()
  const name = encodeURIComponent(domain)

  const { data, source } = await fetchFirst<{ answers: DnsAnswer[]; status: string }>([
    {
      label: 'Cloudflare DoH',
      url: `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
      init: { headers: { accept: 'application/dns-json' } },
      parse: parseDoh,
    },
    {
      label: 'Google DoH',
      url: `https://dns.google/resolve?name=${name}&type=${type}`,
      parse: parseDoh,
    },
    {
      label: '阿里 DoH',
      url: `https://223.5.5.5/resolve?name=${name}&type=${type}`,
      init: { headers: { accept: 'application/dns-json' } },
      parse: parseDoh,
    },
  ])

  return { ...data, source, elapsed: Math.round(performance.now() - started) }
}

export function sortAnswers(answers: DnsAnswer[]): DnsAnswer[] {
  return [...answers].sort((a, b) => a.type.localeCompare(b.type) || a.data.localeCompare(b.data))
}
