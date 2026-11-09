import type { CalcLogic, CalcResult } from '@/components/templates/types'

function ipv4ToGroups(ipv4: string): string[] {
  const parts = ipv4.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    throw new Error('内嵌 IPv4 段不合法')
  }
  const hex = parts.map((n) => n.toString(16).padStart(2, '0')).join('')
  return [hex.slice(0, 4), hex.slice(4, 8)]
}

export function expandIpv6(input: string): string {
  let ip = input.trim().toLowerCase()
  if (!ip.includes(':')) throw new Error('不是 IPv6 地址')

  // IPv4-mapped 形式：::ffff:192.168.1.1
  const v4Match = /(\d{1,3}(?:\.\d{1,3}){3})$/.exec(ip)
  if (v4Match) {
    const groups = ipv4ToGroups(v4Match[1]!)
    ip = ip.replace(v4Match[1]!, `${groups[0]}:${groups[1]}`)
  }

  const [head = '', tail = ''] = ip.split('::')
  const headParts = head ? head.split(':') : []
  const tailParts = tail ? tail.split(':') : []
  const missing = 8 - headParts.length - tailParts.length

  if (!ip.includes('::') && headParts.length !== 8) throw new Error('IPv6 应为 8 组')
  if (missing < 0) throw new Error('分组数量超出 8 组')
  if (ip.split('::').length > 2) throw new Error('只能出现一次 ::')

  const full = [...headParts, ...Array(missing).fill('0'), ...tailParts]
  return full.map((p) => {
    if (!/^[0-9a-f]{1,4}$/.test(p)) throw new Error(`分组「${p}」不是合法十六进制`)
    return p.padStart(4, '0')
  }).join(':')
}

export function compressIpv6(expanded: string): string {
  const groups = expanded.split(':').map((g) => g.replace(/^0+(?=.)/, ''))
  // 找最长连续 0 组
  let bestStart = -1
  let bestLen = 0
  let curStart = -1
  let curLen = 0
  groups.forEach((g, i) => {
    if (g === '0') {
      if (curStart === -1) curStart = i
      curLen++
      if (curLen > bestLen) {
        bestLen = curLen
        bestStart = curStart
      }
    } else {
      curStart = -1
      curLen = 0
    }
  })

  if (bestLen < 2) return groups.join(':')
  const before = groups.slice(0, bestStart).join(':')
  const after = groups.slice(bestStart + bestLen).join(':')
  return `${before}::${after}`
}

export function typeOf(expanded: string): { name: string; hint: string } {
  const first = expanded.slice(0, 4)
  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0001') return { name: '回环地址', hint: '::1' }
  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0000') return { name: '未指定地址', hint: '::' }
  if (/^00/.test(first) && expanded.startsWith('0000:0000:0000:0000:0000:ffff')) return { name: 'IPv4 映射', hint: '::ffff:x.x.x.x' }
  if (/^fe[89ab]/.test(first)) return { name: '链路本地', hint: 'fe80::/10' }
  if (/^f[cd]/.test(first)) return { name: '唯一本地 ULA', hint: 'fc00::/7' }
  if (/^ff/.test(first)) return { name: '组播', hint: 'ff00::/8' }
  if (/^2[0-9a-f]{3}$/.test(first) || /^3[0-9a-f]{3}$/.test(first)) return { name: '全球单播', hint: '2000::/3' }
  return { name: '其他', hint: '—' }
}

const FIELDS = [
  { key: 'input', label: 'IPv6 地址', type: 'text' as const, default: '2408:8207:1a2b:3c4d::1' },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.input ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入 IPv6 地址', emphasis: true }]

  try {
    const expanded = expandIpv6(raw)
    const compressed = compressIpv6(expanded)
    const type = typeOf(expanded)

    return [
      { label: '压缩形式', value: compressed, emphasis: true, hint: type.name },
      { label: '完整展开', value: expanded },
      { label: '地址类型', value: type.name, hint: type.hint },
      { label: '首组', value: expanded.slice(0, 4) },
      { label: '分组数', value: String(expanded.split(':').length) },
    ]
  } catch (e) {
    return [{ label: '解析失败', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '支持 :: 缩写与 IPv4 映射写法，不识别的地址会直接报错',
}

export default logic
