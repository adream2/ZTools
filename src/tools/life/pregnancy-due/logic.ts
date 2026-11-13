import type { CalcLogic, CalcResult } from '@/components/templates/types'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shift(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const FIELDS = [
  { key: 'lmp', label: '末次月经首日', type: 'date' as const, default: shift(-70) },
  { key: 'cycle', label: '月经周期（天）', type: 'number' as const, default: 28, min: 20, max: 45 },
  { key: 'today', label: '计算到哪天', type: 'date' as const, default: todayStr(), hint: '默认今天' },
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

function compute(values: Record<string, string | number>): CalcResult[] {
  const lmp = parse(String(values.lmp))
  const now = parse(String(values.today))
  if (!lmp || !now) return [{ label: '结果', value: '请填写完整日期', emphasis: true }]
  if (lmp > now) return [{ label: '结果', value: '末次月经日期不能晚于今天', emphasis: true }]

  const cycle = Math.min(45, Math.max(20, Math.round(Number(values.cycle)) || 28))
  const offset = cycle - 28
  const edd = new Date(lmp.getTime() + (280 + offset) * 86400000)
  const elapsed = Math.floor((now.getTime() - lmp.getTime()) / 86400000)
  const weeks = Math.floor(elapsed / 7)
  const days = elapsed % 7
  const left = Math.round((edd.getTime() - now.getTime()) / 86400000)

  let stage = '孕早期'
  if (weeks >= 28) stage = '孕晚期'
  else if (weeks >= 14) stage = '孕中期'

  const trimesterDays = weeks >= 28 ? left : weeks >= 14 ? 28 * 7 - elapsed : 14 * 7 - elapsed

  return [
    {
      label: '预产期',
      value: fmt(edd),
      emphasis: true,
      hint: left >= 0 ? `还有 ${left} 天` : `已超过 ${-left} 天`,
    },
    { label: '当前孕周', value: `${weeks} 周 ${days} 天`, hint: `${stage} · 共 ${elapsed} 天` },
    { label: '距下个阶段', value: `${Math.max(0, trimesterDays)} 天`, hint: weeks >= 28 ? '已进入待产阶段' : '按孕周分段' },
    { label: '已过孕期', value: `${Math.min(100, Math.round((elapsed / 280) * 100))}%` },
    { label: '受精日估算', value: fmt(new Date(lmp.getTime() + (14 + offset) * 86400000)), hint: '按周期推算的排卵日' },
    { label: '胎儿足月', value: fmt(new Date(lmp.getTime() + (259 + offset) * 86400000)), hint: '满 37 周即为足月' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '预产期只是估算，实际分娩时间以医生判断为准',
}

export default logic
