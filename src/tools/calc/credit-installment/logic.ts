import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'amount', label: '分期金额（元）', type: 'number' as const, default: 12000, min: 0, step: 500 },
  { key: 'months', label: '期数', type: 'number' as const, default: 12, min: 1, max: 60 },
  { key: 'fee', label: '月费率 %', type: 'number' as const, default: 0.6, step: 0.01, hint: '银行常写 0.6% / 期' },
  {
    key: 'mode',
    label: '手续费收取方式',
    type: 'select' as const,
    default: 'monthly',
    options: [
      { label: '每期收取', value: 'monthly' },
      { label: '首期一次性收取', value: 'once' },
    ],
  },
]

const money = (n: number): string => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

/** 给定月利率，算净现值：正现金流（到手）减未来付款现值 */
function npv(monthlyRate: number, net: number, payment: number, months: number): number {
  let pv = 0
  for (let k = 1; k <= months; k += 1) pv += payment / (1 + monthlyRate) ** k
  return pv - net
}

/** 二分法求月利率，使净现值为 0 */
function solveMonthlyRate(net: number, payment: number, months: number): number {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 120; i += 1) {
    const mid = (lo + hi) / 2
    if (npv(mid, net, payment, months) > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const amount = Number(values.amount)
  const months = Math.max(1, Math.round(Number(values.months)) || 12)
  const feeRate = Number(values.fee)
  if (!Number.isFinite(amount) || amount <= 0) return [{ label: '结果', value: '请输入分期金额', emphasis: true }]
  if (!Number.isFinite(feeRate) || feeRate < 0) return [{ label: '结果', value: '费率不能为负', emphasis: true }]

  const once = String(values.mode) === 'once'
  // 一次性收取是「整期手续费首期扣掉」，总手续费与分期收取相同，差异只在时间
  const fee = ((amount * feeRate) / 100) * months
  const principalPart = amount / months
  const payment = once ? principalPart : principalPart + (amount * feeRate) / 100
  const net = once ? amount - fee : amount

  const monthlyRate = solveMonthlyRate(net, payment, months)
  const aprNominal = monthlyRate * 12 * 100
  const aprEffective = ((1 + monthlyRate) ** 12 - 1) * 100

  return [
    {
      label: '实际年化（复利）',
      value: `${aprEffective.toFixed(2)}%`,
      emphasis: true,
      hint: `表面费率 ${(feeRate * 12).toFixed(2)}%`,
    },
    { label: '实际年化（单利近似）', value: `${aprNominal.toFixed(2)}%`, hint: '月利率 × 12' },
    { label: '实际月利率', value: `${(monthlyRate * 100).toFixed(4)}%` },
    { label: '每期还款', value: money(payment) },
    { label: '总手续费', value: money(fee), hint: once ? '首期一次扣' : `${months} 期 × ${money((amount * feeRate) / 100)}` },
    { label: '总还款', value: money(principalPart * months + fee) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'IRR 按等额本息口径反推，未考虑提前还款违约金',
}

export default logic
