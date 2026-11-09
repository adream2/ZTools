import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'height', label: '身高（cm）', type: 'number' as const, default: 175, min: 50, max: 250 },
  { key: 'weight', label: '体重（kg）', type: 'number' as const, default: 70, min: 10, max: 300, step: 0.1 },
  {
    key: 'standard',
    label: '标准',
    type: 'select' as const,
    default: 'cn',
    options: [
      { label: '中国标准', value: 'cn' },
      { label: 'WHO 国际标准', value: 'who' },
    ],
  },
]

export function bmiOf(heightCm: number, weightKg: number): number {
  const h = heightCm / 100
  return weightKg / (h * h)
}

export function levelOf(bmi: number, standard: string): { label: string; hint: string } {
  if (standard === 'who') {
    if (bmi < 18.5) return { label: '偏瘦', hint: '低于 18.5' }
    if (bmi < 25) return { label: '正常', hint: '18.5 – 24.9' }
    if (bmi < 30) return { label: '超重', hint: '25 – 29.9' }
    if (bmi < 35) return { label: '肥胖 I 级', hint: '30 – 34.9' }
    return { label: '肥胖 II 级以上', hint: '≥ 35' }
  }
  if (bmi < 18.5) return { label: '偏瘦', hint: '低于 18.5' }
  if (bmi < 24) return { label: '正常', hint: '18.5 – 23.9' }
  if (bmi < 28) return { label: '超重', hint: '24 – 27.9' }
  return { label: '肥胖', hint: '≥ 28' }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const h = Number(values.height)
  const w = Number(values.weight)
  if (!h || !w) return [{ label: '结果', value: '请输入身高体重', emphasis: true }]

  const bmi = bmiOf(h, w)
  const level = levelOf(bmi, String(values.standard))
  const hM = h / 100
  const idealMin = (values.standard === 'who' ? 18.5 : 18.5) * hM * hM
  const idealMax = (values.standard === 'who' ? 24.9 : 23.9) * hM * hM

  return [
    { label: 'BMI', value: bmi.toFixed(1), emphasis: true, hint: `${level.label} · ${level.hint}` },
    { label: '理想体重范围', value: `${idealMin.toFixed(1)} – ${idealMax.toFixed(1)} kg` },
    {
      label: '距正常上限',
      value: w > idealMax ? `超 ${(w - idealMax).toFixed(1)} kg` : w < idealMin ? `差 ${(idealMin - w).toFixed(1)} kg` : '已在范围内',
    },
    { label: '基础代谢估算', value: `${Math.round(10 * w + 6.25 * h - 5 * 30 + 5)} kcal/天`, hint: '按 30 岁男性 Mifflin 公式粗估' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'BMI 不区分肌肉与脂肪，运动员可能被误判为超重',
}

export default logic
