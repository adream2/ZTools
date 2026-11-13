import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'watt', label: '功率（W）', type: 'number' as const, default: 1500, min: 1, max: 20000, step: 50 },
  { key: 'hours', label: '每天使用（小时）', type: 'number' as const, default: 2, min: 0, max: 24, step: 0.5 },
  { key: 'days', label: '计算天数', type: 'number' as const, default: 30, min: 1, max: 365 },
  { key: 'price', label: '电价（元/度）', type: 'number' as const, default: 0.6, min: 0, max: 3, step: 0.01 },
]

const money = (n: number): string => `${n.toFixed(2)} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const watt = Number(values.watt)
  const hours = Number(values.hours)
  const days = Math.max(1, Math.round(Number(values.days)) || 30)
  const price = Number(values.price)

  if (![watt, hours, price].every((n) => Number.isFinite(n) && n >= 0)) {
    return [{ label: '结果', value: '请输入功率、时长与电价', emphasis: true }]
  }

  const dailyKwh = (watt / 1000) * hours
  const totalKwh = dailyKwh * days
  const cost = totalKwh * price
  const yearKwh = dailyKwh * 365

  return [
    { label: `电费（${days} 天）`, value: money(cost), emphasis: true, hint: `耗电 ${totalKwh.toFixed(2)} 度` },
    { label: '日均耗电', value: `${dailyKwh.toFixed(3)} 度` },
    { label: '日均电费', value: money(dailyKwh * price) },
    { label: '按此用法一年', value: `${yearKwh.toFixed(1)} 度 / ${money(yearKwh * price)}` },
    {
      label: '相当于',
      value: `${(totalKwh / 1.5).toFixed(1)} 台冰箱日耗`,
      hint: '按常见冰箱每天 1.5 度粗算',
    },
    { label: '换算', value: `${Math.round(watt * hours)} Wh/天`, hint: '1 度 = 1 kWh = 1000 Wh' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按额定功率估算，变频设备实际耗电通常低于此值',
}

export default logic
