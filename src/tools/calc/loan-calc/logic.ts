import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'amount', label: '贷款金额（元）', type: 'number' as const, default: 1000000, min: 1000, step: 10000 },
  { key: 'rate', label: '年利率 %', type: 'number' as const, default: 3.1, step: 0.01, hint: '2024 年后 LPR 常见 3% 左右' },
  { key: 'years', label: '贷款年限', type: 'number' as const, default: 30, min: 1, max: 40 },
  {
    key: 'method',
    label: '还款方式',
    type: 'select' as const,
    default: 'equal-payment',
    options: [
      { label: '等额本息', value: 'equal-payment' },
      { label: '等额本金', value: 'equal-principal' },
    ],
  },
]

const money = (n: number) => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

export function equalPayment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12
  const payment = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1)
  const total = payment * months
  return { monthly: payment, total, interest: total - principal }
}

export function equalPrincipal(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12
  const principalPart = principal / months
  const first = principalPart + principal * r
  const last = principalPart + principalPart * r
  const interest = ((months + 1) * principal * r) / 2
  return { first, last, total: principal + interest, interest, principalPart }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const principal = Number(values.amount)
  const rate = Number(values.rate)
  const years = Math.max(1, Number(values.years) || 1)
  if (!Number.isFinite(principal) || principal <= 0) return [{ label: '结果', value: '请输入贷款金额', emphasis: true }]

  const months = Math.round(years * 12)

  if (values.method === 'equal-principal') {
    const r = equalPrincipal(principal, rate, months)
    return [
      { label: '首月月供', value: money(r.first), emphasis: true, hint: `每月递减约 ${money(principal / months * (rate / 100 / 12))}` },
      { label: '末月月供', value: money(r.last) },
      { label: '每月本金', value: money(r.principalPart) },
      { label: '总利息', value: money(r.interest), hint: `占本金 ${((r.interest / principal) * 100).toFixed(1)}%` },
      { label: '还款总额', value: money(r.total) },
      { label: '期数', value: `${months} 期` },
    ]
  }

  const r = equalPayment(principal, rate, months)
  return [
    { label: '每月月供', value: money(r.monthly), emphasis: true },
    { label: '总利息', value: money(r.interest), hint: `占本金 ${((r.interest / principal) * 100).toFixed(1)}%` },
    { label: '还款总额', value: money(r.total) },
    { label: '期数', value: `${months} 期` },
    { label: '贷款金额', value: money(principal) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '未考虑提前还款、利率调整与手续费，结果仅供估算',
}

export default logic
