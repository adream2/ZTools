import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'n1', label: '第一个分子', type: 'number' as const, default: 1, step: 1 },
  { key: 'd1', label: '第一个分母', type: 'number' as const, default: 2, step: 1 },
  {
    key: 'op',
    label: '运算',
    type: 'select' as const,
    default: 'add',
    options: [
      { label: '加 +', value: 'add' },
      { label: '减 −', value: 'sub' },
      { label: '乘 ×', value: 'mul' },
      { label: '除 ÷', value: 'div' },
    ],
  },
  { key: 'n2', label: '第二个分子', type: 'number' as const, default: 1, step: 1 },
  { key: 'd2', label: '第二个分母', type: 'number' as const, default: 3, step: 1 },
]

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const n1 = Math.round(Number(values.n1))
  const d1 = Math.round(Number(values.d1))
  const n2 = Math.round(Number(values.n2))
  const d2 = Math.round(Number(values.d2))
  const op = String(values.op)

  if (![n1, d1, n2, d2].every(Number.isFinite)) return [{ label: '结果', value: '请填写四个整数', emphasis: true }]
  if (d1 === 0 || d2 === 0) return [{ label: '结果', value: '分母不能为 0', emphasis: true }]

  let n = 0
  let d = 1
  let symbol = '+'
  if (op === 'add') {
    n = n1 * d2 + n2 * d1
    d = d1 * d2
  } else if (op === 'sub') {
    n = n1 * d2 - n2 * d1
    d = d1 * d2
    symbol = '−'
  } else if (op === 'mul') {
    n = n1 * n2
    d = d1 * d2
    symbol = '×'
  } else {
    if (n2 === 0) return [{ label: '结果', value: '除数不能为 0', emphasis: true }]
    n = n1 * d2
    d = d1 * n2
    symbol = '÷'
  }

  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  const rn = n / g
  const rd = d / g

  const whole = Math.trunc(rn / rd)
  const rest = Math.abs(rn - whole * rd)
  const mixed = rd === 1 ? `${rn}` : whole !== 0 ? `${whole} ${rest}/${rd}` : `${rn}/${rd}`

  return [
    { label: '结果', value: rd === 1 ? `${rn}` : `${rn}/${rd}`, emphasis: true, hint: rd === 1 ? '结果为整数' : '已约分' },
    { label: '小数', value: (rn / rd).toFixed(6).replace(/0+$/, '').replace(/\.$/, ''), hint: '最多保留 6 位' },
    { label: '带分数', value: mixed },
    { label: '原式', value: `${n1}/${d1} ${symbol} ${n2}/${d2}` },
    { label: '约分前', value: `${n}/${d}`, hint: `公约数 ${g}` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '只接受整数分子分母，小数请先化成分数',
}

export default logic
