import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
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
  { key: 'height', label: '身高（cm）', type: 'number' as const, default: 175, min: 120, max: 220 },
  { key: 'weight', label: '体重（kg）', type: 'number' as const, default: 70, min: 30, max: 200, step: 0.1 },
  { key: 'neck', label: '颈围（cm）', type: 'number' as const, default: 37, min: 20, max: 60, step: 0.5 },
  { key: 'waist', label: '腰围（cm）', type: 'number' as const, default: 82, min: 40, max: 200, step: 0.5 },
  { key: 'hip', label: '臀围（cm，女性）', type: 'number' as const, default: 95, min: 50, max: 200, step: 0.5 },
]

const INCH = 2.54

function levelOf(bodyFat: number, male: boolean): string {
  if (male) {
    if (bodyFat < 6) return '过低'
    if (bodyFat < 14) return '运动员区间'
    if (bodyFat < 18) return '健康偏瘦'
    if (bodyFat < 25) return '正常'
    return '偏高'
  }
  if (bodyFat < 14) return '过低'
  if (bodyFat < 21) return '运动员区间'
  if (bodyFat < 25) return '健康偏瘦'
  if (bodyFat < 32) return '正常'
  return '偏高'
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const male = String(values.gender) !== 'female'
  const height = Number(values.height) / INCH
  const weight = Number(values.weight)
  const neck = Number(values.neck) / INCH
  const waist = Number(values.waist) / INCH
  const hip = Number(values.hip) / INCH

  if (![height, weight, neck, waist].every((n) => Number.isFinite(n) && n > 0)) {
    return [{ label: '结果', value: '请填写身高、体重与围度', emphasis: true }]
  }

  const log10 = Math.log10
  let bodyFat = 0
  if (male) {
    const diff = waist - neck
    if (diff <= 0) return [{ label: '结果', value: '腰围应大于颈围', emphasis: true }]
    bodyFat = 86.01 * log10(diff) - 70.041 * log10(height) + 36.76
  } else {
    if (!Number.isFinite(hip) || hip <= 0) return [{ label: '结果', value: '女性需要填写臀围', emphasis: true }]
    const sum = waist + hip - neck
    if (sum <= 0) return [{ label: '结果', value: '围度数据不合理', emphasis: true }]
    bodyFat = 163.205 * log10(sum) - 97.684 * log10(height) - 78.387
  }

  bodyFat = Math.max(2, Math.min(70, bodyFat))
  const fatMass = (weight * bodyFat) / 100
  const leanMass = weight - fatMass

  const target = male ? 15 : 23
  const needLose = fatMass - (weight - fatMass) * (target / (100 - target))

  return [
    { label: '体脂率', value: `${bodyFat.toFixed(1)}%`, emphasis: true, hint: levelOf(bodyFat, male) },
    { label: '脂肪重量', value: `${fatMass.toFixed(1)} kg` },
    { label: '去脂体重', value: `${leanMass.toFixed(1)} kg`, hint: '肌肉、骨骼、水分等' },
    {
      label: `降到 ${target}% 需减脂`,
      value: needLose > 0 ? `${needLose.toFixed(1)} kg` : '已在目标以内',
      hint: '假设减脂过程不掉肌肉',
    },
    { label: 'BMI 参考', value: (weight / (Number(values.height) / 100) ** 2).toFixed(1), hint: 'BMI 不含体脂信息' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '美国海军围度公式，结果仅供趋势参考',
}

export default logic
