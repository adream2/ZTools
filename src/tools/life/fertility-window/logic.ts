import type { CalcLogic, CalcResult } from '@/components/templates/types'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const FIELDS = [
  { key: 'lmp', label: '末次月经首日', type: 'date' as const, default: todayStr() },
  { key: 'cycle', label: '周期长度（天）', type: 'number' as const, default: 28, min: 21, max: 40 },
  { key: 'period', label: '经期天数', type: 'number' as const, default: 5, min: 2, max: 10 },
]

function parse(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim())
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return Number.isNaN(d.getTime()) ? null : d
}

function fmt(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function plus(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86400000)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const lmp = parse(String(values.lmp))
  if (!lmp) return [{ label: '结果', value: '请选择末次月经首日', emphasis: true }]

  const cycle = Math.min(40, Math.max(21, Math.round(Number(values.cycle)) || 28))
  const period = Math.min(10, Math.max(2, Math.round(Number(values.period)) || 5))

  const ovulation = plus(lmp, cycle - 14)
  const start = plus(ovulation, -5)
  const end = plus(ovulation, 1)
  const nextPeriod = plus(lmp, cycle)
  const now = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))

  let phase = '卵泡期'
  if (now >= start && now <= end) phase = '易孕期'
  else if (now > end && now < nextPeriod) phase = '黄体期'
  else if (now >= lmp && now < plus(lmp, period)) phase = '经期'

  return [
    { label: '排卵日', value: fmt(ovulation), emphasis: true, hint: `周期第 ${cycle - 14} 天左右` },
    { label: '易孕窗口', value: `${fmt(start)} → ${fmt(end)}`, hint: '共 7 天，前 5 后 1' },
    { label: '下次月经', value: fmt(nextPeriod), hint: `按 ${cycle} 天周期` },
    { label: '当前阶段', value: phase, hint: '按今天与推算窗口对比' },
    { label: '本次经期', value: `${fmt(lmp)} → ${fmt(plus(lmp, period - 1))}` },
    { label: '周期天数', value: `${cycle} 天`, hint: `排卵日倒推 14 天` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '本工具仅做日期推算，不能作为避孕或诊断依据',
}

export default logic
