import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'volume', label: '饮酒量（ml）', type: 'number' as const, default: 500, min: 0, step: 50 },
  { key: 'abv', label: '酒精度（%vol）', type: 'number' as const, default: 4.5, min: 0, max: 96, step: 0.5 },
  { key: 'weight', label: '体重（kg）', type: 'number' as const, default: 65, min: 30, max: 200, step: 0.5 },
  {
    key: 'gender',
    label: '性别',
    type: 'select' as const,
    default: 'male',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
]

const PRESETS: Array<{ name: string; abv: number; volume: number }> = [
  { name: '一听啤酒', abv: 4.5, volume: 330 },
  { name: '一杯红酒', abv: 12, volume: 150 },
  { name: '一两白酒', abv: 52, volume: 50 },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const volume = Number(values.volume)
  const abv = Number(values.abv)
  const weight = Number(values.weight)
  const male = String(values.gender) !== 'female'

  if (![volume, abv, weight].every((n) => Number.isFinite(n) && n >= 0)) {
    return [{ label: '结果', value: '请输入酒量、酒精度与体重', emphasis: true }]
  }
  if (weight <= 0) return [{ label: '结果', value: '体重必须大于 0', emphasis: true }]

  const grams = volume * (abv / 100) * 0.789
  const cups = grams / 10
  const r = male ? 0.68 : 0.55
  const bac = grams / (weight * r)
  const hours = bac / 0.15

  const rows: CalcResult[] = [
    { label: '纯酒精', value: `${grams.toFixed(1)} g`, emphasis: true, hint: `约 ${cups.toFixed(1)} 个标准杯（10 g/杯）` },
    { label: '估算血液酒精', value: `${bac.toFixed(2)}‰`, hint: `Widmark 公式，r=${r}` },
    { label: '完全代谢约需', value: `${hours.toFixed(1)} 小时`, hint: '按每小时下降 0.15‰ 估算' },
    {
      label: '健康风险',
      value: grams <= 15 ? '低' : grams <= 25 ? '中等' : '偏高',
      hint: '男性建议每日 ≤25 g，女性 ≤15 g',
    },
    { label: '参考量', value: PRESETS.map((p) => `${p.name}约 ${(p.volume * (p.abv / 100) * 0.789).toFixed(0)} g`).join('，') },
    { label: '重要提示', value: '不可用于判断能否开车', hint: '代谢速度因人而异，留足时间是唯一稳妥做法' },
  ]

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '估算值仅供了解摄入量，不构成医学或法律判断',
}

export default logic
