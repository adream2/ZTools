import { fetchFirst } from '@/core/net'

export interface IpInfo {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  postal: string
  isp: string
  org: string
  asn: string
  lat: number | null
  lon: number | null
  timezone: string
  source: string
}

interface IpWho {
  success?: boolean
  ip?: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  postal?: string
  latitude?: number
  longitude?: number
  connection?: { isp?: string; org?: string; asn?: number }
  timezone?: { id?: string }
}

interface IpApiCo {
  ip?: string
  country_name?: string
  country_code?: string
  region?: string
  city?: string
  postal?: string
  org?: string
  asn?: string
  latitude?: number
  longitude?: number
  timezone?: string
}

function fromWho(raw: unknown): IpInfo {
  const d = raw as IpWho
  if (d.success === false) throw new Error('该 IP 无法解析')
  return {
    ip: d.ip ?? '',
    country: d.country ?? '',
    countryCode: d.country_code ?? '',
    region: d.region ?? '',
    city: d.city ?? '',
    postal: d.postal ?? '',
    isp: d.connection?.isp ?? '',
    org: d.connection?.org ?? '',
    asn: d.connection?.asn ? `AS${d.connection.asn}` : '',
    lat: d.latitude ?? null,
    lon: d.longitude ?? null,
    timezone: d.timezone?.id ?? '',
    source: 'ipwho.is',
  }
}

function fromIpApiCo(raw: unknown): IpInfo {
  const d = raw as IpApiCo
  if (!d.ip) throw new Error('返回内容缺少 IP 字段')
  return {
    ip: d.ip,
    country: d.country_name ?? '',
    countryCode: d.country_code ?? '',
    region: d.region ?? '',
    city: d.city ?? '',
    postal: d.postal ?? '',
    isp: d.org ?? '',
    org: d.org ?? '',
    asn: d.asn ?? '',
    lat: d.latitude ?? null,
    lon: d.longitude ?? null,
    timezone: d.timezone ?? '',
    source: 'ipapi.co',
  }
}

export async function lookupIp(query: string): Promise<IpInfo> {
  const target = query.trim()
  const suffix = target ? encodeURIComponent(target) : ''

  const { data } = await fetchFirst<IpInfo>([
    { label: 'ipwho.is', url: `https://ipwho.is/${suffix}`, parse: fromWho },
    { label: 'ipapi.co', url: `https://ipapi.co/${suffix ? `${suffix}/` : ''}json/`, parse: fromIpApiCo },
  ])
  return data
}

export async function lookupSelf(): Promise<IpInfo> {
  const { data } = await fetchFirst<IpInfo>([
    { label: 'ipapi.co', url: 'https://ipapi.co/json/', parse: fromIpApiCo },
    { label: 'ipwho.is', url: 'https://ipwho.is/', parse: fromWho },
  ])
  return data
}

export function validateQuery(input: string): string {
  const q = input.trim()
  if (!q) return ''
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(q)) {
    const ok = q.split('.').every((n) => Number(n) >= 0 && Number(n) <= 255)
    if (!ok) throw new Error('IPv4 每段必须在 0–255 之间')
    return q
  }
  if (/^[0-9a-fA-F:]+$/.test(q) && q.includes(':')) return q
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(q)) return q
  throw new Error('请输入合法的 IP 或域名')
}

export function flagEmoji(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return ''
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}
