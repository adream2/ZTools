import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'weight', label: '体重（kg）', type: 'number' as const, default: 60, min: 20, max: 200, step: 0.5 },
  { key: 'exercise', label: '每天运动（分钟）', type: 'number' as const, default: 30, min: 0, max: 300 },
  {
    key: 'climate',
    label: '环境',
    type: 'select' as const,
    default: 'mild',
    options: [
      { label: '常温 / 空调房', value: 'mild' },
      { label: '高温或户外', value: 'hot' },
      { label: '寒冷干燥', value: 'cold' },
    ],
  },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const weight = Number(values.weight)
  if (!Number.isFinite(weight) || weight <= 0) return [{ label: '结果', value: '请输入体重', emphasis: true }]

  const exercise = Math.max(0, Number(values.exercise) || 0)
  const climate = String(values.climate)

  const base = weight * 33
  const sport = (exercise / 30) * 400
  const adjust = climate === 'hot' ? 600 : climate === 'cold' ? -150 : 0
  const total = Math.max(1200, Math.round(base + sport + adjust))

  const cups = Math.round(total / 250)
  const perHour = Math.round(total / 12)

  return [
    { label: '建议每日饮水', value: `${total} ml`, emphasis: true, hint: `约 ${cups} 杯（250 ml）` },
    { label: '基础部分', value: `${Math.round(base)} ml`, hint: `${weight} kg × 33 ml` },
    { label: '运动补充', value: `${Math.round(sport)} ml`, hint: `${exercise} 分钟，每 30 分钟 400 ml` },
    { label: '环境修正', value: `${adjust >= 0 ? '+' : ''}${adjust} ml`, hint: climate === 'hot' ? '高温出汗多' : climate === 'cold' ? '出汗少但要防干燥' : '无明显修正' },
    { label: '分次参考', value: `每 2 小时约 ${perHour} ml`, hint: '清醒 12 小时均摊' },
    { label: '单次上限', value: '≤ 400 ml', hint: '短时间大量饮水会增加肾脏负担' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '心肾功能异常、服用利尿剂的人请遵医嘱，不要照公式喝',
}

export default logic
