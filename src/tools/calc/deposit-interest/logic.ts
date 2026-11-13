import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'principal', label: '存款金额（元）', type: 'number' as const, default: 50000, min: 0, step: 1000 },
  { key: 'rate', label: '年利率 %', type: 'number' as const, default: 1.75, step: 0.05, hint: '定期一年常见 1.5–2%' },
  { key: 'months', label: '存期（月）', type: 'number' as const, default: 12, min: 1, max: 120 },
  {
    key: 'mode',
    label: '计息方式',
    type: 'select' as const,
    default: 'simple',
    options: [
      { label: '单利（到期一次付息）', value: 'simple' },
      { label: '复利（自动转存）', value: 'compound' },
    ],
  },
]

const money = (n: number): string => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const principal = Number(values.principal)
  const rate = Number(values.rate)
  const months = Math.max(1, Math.round(Number(values.months)) || 12)
  if (!Number.isFinite(principal) || principal <= 0) return [{ label: '结果', value: '请输入存款金额', emphasis: true }]

  const r = rate / 100
  const simple = (principal * r * months) / 12
  const compound = principal * ((1 + r / 12) ** months - 1)
  const interest = String(values.mode) === 'compound' ? compound : simple

  const demand = (principal * 0.002 * months) / 12

  return [
    { label: '到期利息', value: money(interest), emphasis: true, hint: `${months} 个月，年利率 ${rate}%` },
    { label: '本息合计', value: money(principal + interest) },
    { label: '月均利息', value: money(interest / months) },
    { label: '折合实际年化', value: `${((interest / principal) * (12 / months) * 100).toFixed(3)}%` },
    { label: '若放活期(0.2%)', value: money(demand), hint: `少赚 ${money(interest - demand)}` },
    { label: '复利差额', value: money(compound - simple), hint: '自动转存才拿得到' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '未考虑利息税（国内储蓄存款利息目前免税）',
}

export default logic
