import type { CalcLogic, CalcResult } from '@/components/templates/types'

function ipToInt(ip: string): number {
  const parts = ip.split('.')
  if (parts.length !== 4) throw new Error('IP 需要四段')
  let n = 0
  for (const p of parts) {
    const v = Number(p)
    if (!Number.isInteger(v) || v < 0 || v > 255) throw new Error(`「${p}」不是合法 IP 段`)
    n = n * 256 + v
  }
  return n >>> 0
}

function intToIp(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 0xff).join('.')
}

export function parseCidr(input: string) {
  const m = /^([\d.]+)(?:\/(\d{1,2}))?$/.exec(input.trim())
  if (!m) throw new Error('格式应为 192.168.1.0/24')
  const ip = m[1]!
  const prefix = m[2] === undefined ? 32 : Number(m[2])
  if (prefix < 0 || prefix > 32) throw new Error('前缀长度需在 0–32')

  const ipInt = ipToInt(ip)
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (ipInt & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const total = 2 ** (32 - prefix)
  const usable = prefix >= 31 ? total : Math.max(0, total - 2)

  return {
    ip,
    prefix,
    mask: intToIp(mask),
    wildcard: intToIp(~mask >>> 0),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    first: prefix >= 31 ? intToIp(network) : intToIp(network + 1),
    last: prefix >= 31 ? intToIp(broadcast) : intToIp(broadcast - 1),
    total,
    usable,
    networkInt: network,
    broadcastInt: broadcast,
  }
}

const FIELDS = [{ key: 'cidr', label: 'CIDR 或 IP', type: 'text' as const, default: '192.168.1.0/24' }]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.cidr ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入网段', emphasis: true }]
  const r = parseCidr(raw)

  return [
    { label: '网段', value: `${r.network}/${r.prefix}`, emphasis: true, hint: `共 ${r.total.toLocaleString()} 个地址` },
    { label: '子网掩码', value: r.mask },
    { label: '反掩码', value: r.wildcard, hint: 'ACL / OSPF 用' },
    { label: '网络地址', value: r.network },
    { label: '广播地址', value: r.prefix >= 31 ? '无' : r.broadcast },
    { label: '可用范围', value: r.prefix >= 31 ? r.first : `${r.first} – ${r.last}` },
    { label: '可用数量', value: `${r.usable.toLocaleString()} 个` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '/31 与 /32 按点对点与单机处理，不再扣除网络位与广播位',
}

export default logic
