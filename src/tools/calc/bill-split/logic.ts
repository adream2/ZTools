import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'total', label: '账单总额（元）', type: 'number' as const, default: 368, min: 0, step: 1 },
  { key: 'people', label: '人数', type: 'number' as const, default: 4, min: 1, max: 50 },
  { key: 'tip', label: '小费 / 服务费 %', type: 'number' as const, default: 0, min: 0, max: 30, step: 1 },
  { key: 'round', label: '向上取整到元', type: 'switch' as const, default: true },
]

const money = (n: number) => `${n.toFixed(2)} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const total = Number(values.total) || 0
  const people = Math.max(1, Math.floor(Number(values.people) || 1))
  const tipRate = Number(values.tip) || 0

  const tip = (total * tipRate) / 100
  const grand = total + tip
  const raw = grand / people
  const each = values.round ? Math.ceil(raw) : Math.round(raw * 100) / 100
  const collected = each * people

  return [
    { label: '每人应付', value: money(each), emphasis: true, hint: `共 ${people} 人` },
    { label: '含小费总额', value: money(grand), hint: tipRate ? `小费 ${money(tip)}` : '未加小费' },
    { label: '人均（精确）', value: money(raw) },
    { label: '多收 / 少收', value: money(collected - grand), hint: values.round ? '取整产生的差额' : '—' },
    { label: '拆账建议', value: `${people - 1} 人付 ${money(each)}，1 人付 ${money(Math.round((grand - each * (people - 1)) * 100) / 100)}` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '取整后多余的部分由最后一人承担，避免有人多付',
}

export default logic
