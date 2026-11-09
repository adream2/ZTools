import type { CalcLogic } from '@/components/templates/types'

export function ipToInt(ip: string): number {
  const parts = ip.trim().split('.')
  if (parts.length !== 4) throw new Error('IPv4 需要四段')
  let value = 0
  for (const part of parts) {
    const n = Number(part)
    if (!Number.isInteger(n) || n < 0 || n > 255) throw new Error(`「${part}」不是 0–255 的数字`)
    value = value * 256 + n
  }
  return value
}

export function intToIp(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) throw new Error('整数需要在 0–4294967295 之间')
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 0xff).join('.')
}

const FIELDS = [
  { key: 'input', label: 'IPv4 或整数', type: 'text' as const, default: '192.168.1.1' },
]

function compute(values: Record<string, string | number>) {
  const raw = String(values.input ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入 IP 或整数', emphasis: true }]

  const isIp = raw.includes('.')
  const int = isIp ? ipToInt(raw) : Number(raw)
  if (!isIp && !Number.isInteger(int)) throw new Error('整数无效')
  const ip = isIp ? raw : intToIp(int)

  const binary = int.toString(2).padStart(32, '0')
  // 位运算会把 > 2^31 的值转成有符号整数，必须 >>>0 转回无符号
  const network = (int & 0xffffff00) >>> 0

  return [
    { label: '点分十进制', value: ip, emphasis: true },
    { label: '整数', value: String(int) },
    { label: '十六进制', value: `0x${int.toString(16).toUpperCase()}` },
    { label: '二进制', value: binary.replace(/(.{8})(?=.)/g, '$1.') },
    { label: '所属网段 /24', value: `${intToIp(network)}/24` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '整数按无符号 32 位处理，与数据库 INET_ATON 一致',
}

export default logic
