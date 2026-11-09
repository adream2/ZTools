import type { CalcLogic, CalcResult } from '@/components/templates/types'

/** 以毫升为基准的美制烹饪单位 */
const VOLUME: Record<string, number> = {
  cup: 236.588,
  tbsp: 14.787,
  tsp: 4.929,
  ml: 1,
  floz: 29.574,
}

const FIELDS = [
  { key: 'value', label: '数量', type: 'number' as const, default: 1, min: 0, step: 0.25 },
  {
    key: 'unit',
    label: '单位',
    type: 'select' as const,
    default: 'cup',
    options: [
      { label: '杯 cup', value: 'cup' },
      { label: '汤匙 tbsp', value: 'tbsp' },
      { label: '茶匙 tsp', value: 'tsp' },
      { label: '毫升 ml', value: 'ml' },
      { label: '液量盎司 fl oz', value: 'floz' },
    ],
  },
  {
    key: 'density',
    label: '食材密度',
    type: 'select' as const,
    default: '1',
    options: [
      { label: '水 / 牛奶（1.0）', value: '1' },
      { label: '面粉（0.53）', value: '0.53' },
      { label: '白砂糖（0.85）', value: '0.85' },
      { label: '黄油（0.91）', value: '0.91' },
      { label: '蜂蜜（1.42）', value: '1.42' },
    ],
  },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const value = Number(values.value) || 0
  const unit = String(values.unit)
  const density = Number(values.density) || 1
  const ml = value * (VOLUME[unit] ?? 1)

  const fmt = (n: number) => String(Number(n.toFixed(2)))

  return [
    { label: '毫升', value: `${fmt(ml)} ml`, emphasis: true },
    { label: '克（按密度）', value: `${fmt(ml * density)} g`, hint: `密度 ${density}` },
    { label: '杯', value: `${fmt(ml / VOLUME.cup!)} cup` },
    { label: '汤匙', value: `${fmt(ml / VOLUME.tbsp!)} tbsp` },
    { label: '茶匙', value: `${fmt(ml / VOLUME.tsp!)} tsp` },
    { label: '液量盎司', value: `${fmt(ml / VOLUME.floz!)} fl oz` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按美制单位换算；同一体积下不同食材重量差别很大，务必按密度调整',
}

export default logic
