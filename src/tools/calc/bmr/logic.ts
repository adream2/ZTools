import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'gender', label: '性别', type: 'select' as const, default: 'male', options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] },
  { key: 'age', label: '年龄', type: 'number' as const, default: 30, min: 10, max: 100 },
  { key: 'height', label: '身高（cm）', type: 'number' as const, default: 175, min: 100, max: 250 },
  { key: 'weight', label: '体重（kg）', type: 'number' as const, default: 70, min: 25, max: 300, step: 0.1 },
  {
    key: 'activity',
    label: '活动水平',
    type: 'select' as const,
    default: '1.55',
    options: [
      { label: '久坐（几乎不运动）', value: '1.2' },
      { label: '轻度（每周 1–3 次）', value: '1.375' },
      { label: '中度（每周 3–5 次）', value: '1.55' },
      { label: '高强度（每周 6–7 次）', value: '1.725' },
      { label: '极高（体力劳动）', value: '1.9' },
    ],
  },
]

const kcal = (n: number) => `${Math.round(n)} kcal`

function compute(values: Record<string, string | number>): CalcResult[] {
  const male = values.gender === 'male'
  const age = Number(values.age) || 30
  const h = Number(values.height) || 170
  const w = Number(values.weight) || 65

  // Mifflin-St Jeor
  const bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161)
  const factor = Number(values.activity) || 1.55
  const tdee = bmr * factor

  return [
    { label: '基础代谢 BMR', value: kcal(bmr), emphasis: true, hint: '躺着不动一天消耗' },
    { label: '每日总消耗 TDEE', value: kcal(tdee), hint: `活动系数 ${factor}` },
    { label: '减脂区间', value: `${kcal(tdee - 500)} – ${kcal(tdee - 300)}`, hint: '每周约减 0.3–0.5 kg' },
    { label: '增肌区间', value: `${kcal(tdee + 200)} – ${kcal(tdee + 400)}` },
    { label: '维持体重', value: kcal(tdee) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'Mifflin-St Jeor 公式，估算值与实测可能差 10% 左右',
}

export default logic
