import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'nums', label: '整数列表', type: 'text' as const, default: '12, 18, 24', hint: '逗号 / 空格 / 换行分隔' },
]

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

function bigGcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a
  let y = b < 0n ? -b : b
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.nums ?? '')
  const list = raw
    .split(/[^0-9-]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)

  if (list.length < 2) return [{ label: '结果', value: '至少输入两个整数', emphasis: true }]
  if (list.length > 10) return [{ label: '结果', value: '最多 10 个整数', emphasis: true }]
  if (list.some((n) => !Number.isSafeInteger(n) || n === 0)) {
    return [{ label: '结果', value: '请输入非零整数（安全整数范围内）', emphasis: true }]
  }

  let g = Math.abs(list[0]!)
  for (const n of list.slice(1)) g = gcd(g, n)

  let l = 1n
  for (const n of list) {
    const bn = BigInt(n)
    l = (l / bigGcd(l, bn)) * bn
    if (l < 0n) l = -l
  }

  const coprime = g === 1

  return [
    { label: '最大公约数', value: String(g), emphasis: true, hint: coprime ? '这些数互质' : `都能被 ${g} 整除` },
    { label: '最小公倍数', value: l.toString() },
    { label: '参与计算', value: `${list.length} 个：${list.join(', ')}` },
    { label: '约数检查', value: list.map((n) => `${n}÷${g}=${n / g}`).join('，'), hint: '验证公约数' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '负数按绝对值参与计算，0 不参与',
}

export default logic
