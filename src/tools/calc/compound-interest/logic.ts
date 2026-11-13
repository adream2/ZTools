import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'principal', label: '初始本金（元）', type: 'number' as const, default: 100000, min: 0, step: 1000 },
  { key: 'rate', label: '年化收益率 %', type: 'number' as const, default: 5, step: 0.1 },
  { key: 'years', label: '投资年限', type: 'number' as const, default: 10, min: 0, max: 80 },
  { key: 'yearly', label: '每年追加（元）', type: 'number' as const, default: 12000, min: 0, step: 1000 },
  {
    key: 'freq',
    label: '复利频率',
    type: 'select' as const,
    default: 12,
    options: [
      { label: '按年', value: 1 },
      { label: '按季', value: 4 },
      { label: '按月', value: 12 },
    ],
  },
]

const money = (n: number): string =>
  `${n.toLocaleString('zh-CN', { maximumFractionDigits: 0 })} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const principal = Number(values.principal)
  const rate = Number(values.rate)
  const years = Math.max(0, Number(values.years) || 0)
  const yearly = Math.max(0, Number(values.yearly) || 0)
  const freq = Math.max(1, Math.round(Number(values.freq)) || 1)

  if (!Number.isFinite(principal) || principal < 0) return [{ label: '结果', value: '请输入本金', emphasis: true }]

  const r = rate / 100
  const growth = (1 + r / freq) ** (freq * years)
  const fromPrincipal = principal * growth

  // 每年追加按年末投入，用实际年化折算
  const aer = (1 + r / freq) ** freq - 1
  const fromYearly = yearly === 0 ? 0 : Math.abs(aer) < 1e-9 ? yearly * years : (yearly * ((1 + aer) ** years - 1)) / aer

  const total = fromPrincipal + fromYearly
  const invested = principal + yearly * years
  const simple = principal * (1 + r * years) + yearly * years

  return [
    { label: '到期总额', value: money(total), emphasis: true, hint: `赚 ${money(total - invested)}` },
    { label: '本金合计', value: money(invested), hint: yearly > 0 ? `含 ${years} 年 × ${money(yearly)}` : '无追加' },
    { label: '其中利息', value: money(total - invested) },
    { label: '实际年化', value: `${((aer) * 100).toFixed(2)}%`, hint: `名义 ${rate}%，${freq === 12 ? '按月' : freq === 4 ? '按季' : '按年'}复利` },
    { label: '单利同条件', value: money(simple), hint: `复利比单利多 ${money(total - simple)}` },
    { label: '资金翻倍约需', value: rate > 0 ? `${(72 / rate).toFixed(1)} 年` : '不翻倍', hint: '72 法则粗算' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '不考虑税费与申赎费用，收益率按恒定假设',
}

export default logic
