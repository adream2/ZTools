import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'gross', label: '税前月薪（元）', type: 'number' as const, default: 20000, min: 0, step: 500 },
  { key: 'social', label: '社保个人比例 %', type: 'number' as const, default: 10.5, step: 0.1, hint: '养老 8 + 医疗 2 + 失业 0.5' },
  { key: 'fund', label: '公积金个人比例 %', type: 'number' as const, default: 12, step: 0.5, hint: '5–12%，单位同比例缴纳' },
  { key: 'special', label: '专项附加扣除（元/月）', type: 'number' as const, default: 2000, min: 0, step: 500, hint: '房贷 1000 / 租房 1500 / 赡养 3000 等' },
]

/** 月度综合所得税率表（速算扣除数） */
const BRACKETS: Array<{ limit: number; rate: number; deduct: number }> = [
  { limit: 3000, rate: 0.03, deduct: 0 },
  { limit: 12000, rate: 0.1, deduct: 210 },
  { limit: 25000, rate: 0.2, deduct: 1410 },
  { limit: 35000, rate: 0.25, deduct: 2660 },
  { limit: 55000, rate: 0.3, deduct: 4410 },
  { limit: 80000, rate: 0.35, deduct: 7160 },
  { limit: Infinity, rate: 0.45, deduct: 15160 },
]

const money = (n: number): string => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const gross = Number(values.gross)
  if (!Number.isFinite(gross) || gross <= 0) return [{ label: '结果', value: '请输入税前月薪', emphasis: true }]

  const socialRate = Math.max(0, Number(values.social) || 0) / 100
  const fundRate = Math.max(0, Number(values.fund) || 0) / 100
  const special = Math.max(0, Number(values.special) || 0)

  const social = gross * socialRate
  const fund = gross * fundRate
  const taxable = Math.max(0, gross - 5000 - social - fund - special)
  const bracket = BRACKETS.find((b) => taxable <= b.limit)!
  const tax = Math.max(0, taxable * bracket.rate - bracket.deduct)
  const net = gross - social - fund - tax

  return [
    { label: '税后到手', value: money(net), emphasis: true, hint: `到手比例 ${((net / gross) * 100).toFixed(1)}%` },
    { label: '个人所得税', value: money(tax), hint: `适用 ${(bracket.rate * 100).toFixed(0)}% 档` },
    { label: '五险一金', value: money(social + fund), hint: `社保 ${money(social)} + 公积金 ${money(fund)}` },
    { label: '应纳税所得额', value: money(taxable), hint: `起征点 5000 + 专项 ${money(special)}` },
    { label: '实际税负', value: `${((tax / gross) * 100).toFixed(2)}%`, hint: '个税 / 税前' },
    { label: '公积金账户月增', value: money(fund * 2), hint: '个人 + 单位同比例（按 1:1 估算）' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按月度税率表估算，与全年累计预扣结果可能有差异',
}

export default logic
