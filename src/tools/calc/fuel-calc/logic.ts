import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'price', label: '油价（元/升）', type: 'number' as const, default: 7.8, min: 1, step: 0.01 },
  { key: 'cost', label: '本次加油金额（元）', type: 'number' as const, default: 300, min: 1, step: 10 },
  { key: 'distance', label: '行驶里程（km）', type: 'number' as const, default: 500, min: 1, step: 10 },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const price = Number(values.price) || 0
  const cost = Number(values.cost) || 0
  const distance = Number(values.distance) || 0

  if (!price || !cost || !distance) return [{ label: '结果', value: '请填写油价、金额与里程', emphasis: true }]

  const liters = cost / price
  const per100 = (liters / distance) * 100
  const perKm = cost / distance
  const perLiterKm = distance / liters

  return [
    { label: '百公里油耗', value: `${per100.toFixed(2)} L/100km`, emphasis: true },
    { label: '每公里油费', value: `${perKm.toFixed(3)} 元` },
    { label: '本次加油量', value: `${liters.toFixed(2)} L` },
    { label: '每升可跑', value: `${perLiterKm.toFixed(2)} km` },
    { label: '一万公里油费', value: `${(perKm * 10000).toFixed(0)} 元` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按「加满到加满」口径最准，单次估算仅供参考',
}

export default logic
