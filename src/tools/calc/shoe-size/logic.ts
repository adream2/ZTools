import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'length', label: '脚长（cm）', type: 'number' as const, default: 25, min: 15, max: 35, step: 0.1, hint: '量最长脚趾到脚后跟' },
  {
    key: 'gender',
    label: '性别',
    type: 'select' as const,
    default: 'male',
    options: [
      { label: '男款', value: 'male' },
      { label: '女款', value: 'female' },
    ],
  },
]

/** 中国码 = 脚长 cm × 2 − 10 */
export function cnSize(cm: number): number {
  return Math.round(cm * 2 - 10)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const cm = Number(values.length)
  if (!cm) return [{ label: '结果', value: '请输入脚长', emphasis: true }]

  const cn = cnSize(cm)
  const eu = cn // 中国码与欧码同号
  const us = values.gender === 'male' ? cm * 3 - 22 : cm * 3 - 21
  const uk = us - 1
  const jp = cm

  return [
    { label: '中国码', value: `${cn} 码`, emphasis: true, hint: `${cm} cm` },
    { label: '欧码 EU', value: String(eu) },
    { label: '美码 US', value: us.toFixed(1) },
    { label: '英码 UK', value: uk.toFixed(1) },
    { label: '日本码 JP', value: `${jp.toFixed(1)} cm` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '各品牌楦型差异较大，运动鞋常建议加 0.5 码，买前最好试穿',
}

export default logic
