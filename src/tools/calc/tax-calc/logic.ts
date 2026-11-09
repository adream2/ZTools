import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'salary', label: '月工资（元）', type: 'number' as const, default: 20000, min: 0, step: 100 },
  { key: 'insurance', label: '五险一金（元/月）', type: 'number' as const, default: 3000, min: 0, step: 100 },
  { key: 'special', label: '专项附加扣除（元/月）', type: 'number' as const, default: 1000, min: 0, step: 100, hint: '子女教育、房贷等' },
  { key: 'bonus', label: '年终奖（元，可选）', type: 'number' as const, default: 0, min: 0, step: 1000 },
]

/** 综合所得年度税率表 */
const BRACKETS: [number, number, number][] = [
  [36000, 0.03, 0],
  [144000, 0.1, 2520],
  [300000, 0.2, 16920],
  [420000, 0.25, 31920],
  [660000, 0.3, 52920],
  [960000, 0.35, 85920],
  [Infinity, 0.45, 181920],
]

/** 年终奖单独计税月度税率表 */
const BONUS: [number, number, number][] = [
  [3000, 0.03, 0],
  [12000, 0.1, 210],
  [25000, 0.2, 1410],
  [35000, 0.25, 2660],
  [55000, 0.3, 4410],
  [80000, 0.35, 7160],
  [Infinity, 0.45, 15160],
]

const money = (n: number) => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

export function incomeTax(taxable: number): number {
  const b = BRACKETS.find(([limit]) => taxable <= limit)!
  return Math.max(0, taxable * b[1] - b[2])
}

export function bonusTax(bonus: number): { tax: number; rate: number } {
  if (bonus <= 0) return { tax: 0, rate: 0 }
  const monthly = bonus / 12
  const b = BONUS.find(([limit]) => monthly <= limit)!
  return { tax: Math.max(0, bonus * b[1] - b[2]), rate: b[1] }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const salary = Number(values.salary) || 0
  const insurance = Number(values.insurance) || 0
  const special = Number(values.special) || 0
  const bonus = Number(values.bonus) || 0

  const monthlyTaxable = Math.max(0, salary - insurance - special - 5000)
  const yearlyTaxable = monthlyTaxable * 12
  const yearlyTax = incomeTax(yearlyTaxable)
  const monthlyTax = yearlyTax / 12
  const afterTax = salary - insurance - monthlyTax

  const results: CalcResult[] = [
    { label: '税后到手（月）', value: money(afterTax), emphasis: true, hint: `已扣五险一金 ${money(insurance)}` },
    { label: '每月个税', value: money(monthlyTax) },
    { label: '应纳税所得额（月）', value: money(monthlyTaxable), hint: '工资 − 五险一金 − 专扣 − 5000' },
    { label: '全年个税', value: money(yearlyTax) },
  ]

  if (bonus > 0) {
    const b = bonusTax(bonus)
    results.push(
      { label: '年终奖个税（单独计税）', value: money(b.tax), hint: `适用 ${(b.rate * 100).toFixed(0)}% 税率` },
      { label: '年终奖到手', value: money(bonus - b.tax) },
    )
  }

  return results
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按年度累计预扣法估算，未考虑跨档税率跳变与地方差异',
}

export default logic
