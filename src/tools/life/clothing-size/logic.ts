import type { CalcLogic, CalcResult } from '@/components/templates/types'

interface Band {
  height: number
  intl: string
  cn: string
  eu: string
  us: string
  weight: [number, number]
}

const MEN: Band[] = [
  { height: 160, intl: 'S', cn: '165/84A', eu: '46', us: 'S', weight: [50, 58] },
  { height: 165, intl: 'M', cn: '170/88A', eu: '48', us: 'M', weight: [58, 66] },
  { height: 170, intl: 'L', cn: '175/92A', eu: '50', us: 'M', weight: [66, 74] },
  { height: 175, intl: 'XL', cn: '180/96A', eu: '52', us: 'L', weight: [74, 82] },
  { height: 180, intl: '2XL', cn: '185/100A', eu: '54', us: 'L', weight: [82, 90] },
  { height: 185, intl: '3XL', cn: '190/104A', eu: '56', us: 'XL', weight: [90, 100] },
]

const WOMEN: Band[] = [
  { height: 150, intl: 'XS', cn: '155/76A', eu: '32', us: 'XS', weight: [40, 46] },
  { height: 155, intl: 'S', cn: '160/80A', eu: '34', us: 'S', weight: [46, 52] },
  { height: 160, intl: 'M', cn: '165/84A', eu: '36', us: 'M', weight: [52, 58] },
  { height: 165, intl: 'L', cn: '170/88A', eu: '38', us: 'L', weight: [58, 64] },
  { height: 170, intl: 'XL', cn: '175/92A', eu: '40', us: 'L', weight: [64, 72] },
  { height: 175, intl: '2XL', cn: '180/96A', eu: '42', us: 'XL', weight: [72, 80] },
]

const FIELDS = [
  {
    key: 'gender',
    label: '性别',
    type: 'select' as const,
    default: 'men',
    options: [
      { label: '男装', value: 'men' },
      { label: '女装', value: 'women' },
    ],
  },
  { key: 'height', label: '身高（cm）', type: 'number' as const, default: 175, min: 140, max: 210 },
  { key: 'weight', label: '体重（kg）', type: 'number' as const, default: 70, min: 35, max: 150 },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const gender = String(values.gender) === 'women' ? 'women' : 'men'
  const height = Number(values.height)
  const weight = Number(values.weight)
  if (!Number.isFinite(height) || height <= 0) return [{ label: '结果', value: '请输入身高', emphasis: true }]

  const table = gender === 'women' ? WOMEN : MEN
  let idx = table.findIndex((b) => height <= b.height)
  if (idx < 0) idx = table.length - 1

  if (Number.isFinite(weight) && weight > 0) {
    const band = table[idx]!
    if (weight > band.weight[1] + 2) idx = Math.min(table.length - 1, idx + 1)
    else if (weight < band.weight[0] - 2) idx = Math.max(0, idx - 1)
  }

  const pick = table[idx]!
  const alt = table[Math.min(table.length - 1, idx + 1)]!

  return [
    { label: '推荐尺码', value: pick.intl, emphasis: true, hint: `号型 ${pick.cn}` },
    { label: '欧码', value: pick.eu, hint: '欧洲成衣码' },
    { label: '美码', value: pick.us, hint: '美国通用码' },
    { label: '适配身高', value: `${pick.height} cm 左右` },
    { label: '适配体重', value: `${pick.weight[0]}–${pick.weight[1]} kg` },
    { label: '偏胖可大一码', value: alt.intl, hint: '介于两码之间时按胸围选' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '尺码表为通用参考，具体看品牌自己的尺码表与版型',
}

export default logic
