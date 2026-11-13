import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'type',
    label: '类型',
    type: 'select' as const,
    default: 'arithmetic',
    options: [
      { label: '等差数列（公差 d）', value: 'arithmetic' },
      { label: '等比数列（公比 q）', value: 'geometric' },
    ],
  },
  { key: 'a1', label: '首项 a₁', type: 'number' as const, default: 1, step: 1 },
  { key: 'd', label: '公差 d / 公比 q', type: 'number' as const, default: 2, step: 1 },
  { key: 'n', label: '项数 n', type: 'number' as const, default: 10, min: 1, max: 200 },
]

const fmt = (n: number): string => {
  if (!Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1e15) return n.toExponential(4)
  const r = Number(n.toFixed(6))
  return Object.is(r, -0) ? '0' : String(r)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const a1 = Number(values.a1)
  const d = Number(values.d)
  const n = Math.max(1, Math.min(200, Math.round(Number(values.n)) || 1))
  if (!Number.isFinite(a1) || !Number.isFinite(d)) return [{ label: '结果', value: '请填写首项与公差', emphasis: true }]

  const arithmetic = String(values.type) !== 'geometric'
  const first = Array.from({ length: Math.min(5, n) }, (_, i) => fmt(arithmetic ? a1 + i * d : a1 * d ** i))

  if (arithmetic) {
    const an = a1 + (n - 1) * d
    const sum = ((a1 + an) * n) / 2
    return [
      { label: `第 ${n} 项 aₙ`, value: fmt(an), emphasis: true, hint: `aₙ = a₁ + (n−1)d` },
      { label: `前 ${n} 项和 Sₙ`, value: fmt(sum), hint: `(首项 + 末项) × n ÷ 2` },
      { label: '通项公式', value: `aₙ = ${fmt(a1)} + (n−1) × ${fmt(d)}` },
      { label: '前几项', value: first.join('、') },
      { label: '公差', value: fmt(d) },
      { label: '递增 / 递减', value: d > 0 ? '递增' : d < 0 ? '递减' : '常数列' },
    ]
  }

  const an = a1 * d ** (n - 1)
  const sum = d === 1 ? a1 * n : (a1 * (d ** n - 1)) / (d - 1)
  return [
    { label: `第 ${n} 项 aₙ`, value: fmt(an), emphasis: true, hint: 'aₙ = a₁ × q^(n−1)' },
    { label: `前 ${n} 项和 Sₙ`, value: fmt(sum), hint: d === 1 ? '公比为 1，等于 a₁ × n' : 'a₁(1−q^n)/(1−q)' },
    { label: '通项公式', value: `aₙ = ${fmt(a1)} × ${fmt(d)}^(n−1)` },
    { label: '前几项', value: first.join('、') },
    { label: '公比', value: fmt(d) },
    { label: '收敛性', value: Math.abs(d) < 1 ? '无穷和收敛' : '无穷和发散', hint: '|q| < 1 时收敛' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '项数上限 200，避免数值溢出',
}

export default logic
