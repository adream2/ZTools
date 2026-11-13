import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'father', label: '父亲身高（cm）', type: 'number' as const, default: 175, min: 140, max: 220, step: 0.5 },
  { key: 'mother', label: '母亲身高（cm）', type: 'number' as const, default: 163, min: 140, max: 220, step: 0.5 },
  {
    key: 'gender',
    label: '孩子性别',
    type: 'select' as const,
    default: 'male',
    options: [
      { label: '男孩', value: 'male' },
      { label: '女孩', value: 'female' },
    ],
  },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const father = Number(values.father)
  const mother = Number(values.mother)
  const male = String(values.gender) !== 'female'

  if (!Number.isFinite(father) || !Number.isFinite(mother) || father <= 0 || mother <= 0) {
    return [{ label: '结果', value: '请输入父母身高', emphasis: true }]
  }
  if (father < 130 || mother < 130 || father > 230 || mother > 230) {
    return [{ label: '结果', value: '身高数值看起来不太对，请确认单位是厘米', emphasis: true }]
  }

  const target = male ? (father + mother + 13) / 2 : (father + mother - 13) / 2
  const low = target - 5
  const high = target + 5

  return [
    {
      label: '遗传靶身高',
      value: `${target.toFixed(1)} cm`,
      emphasis: true,
      hint: `正常范围 ${low.toFixed(1)} – ${high.toFixed(1)} cm`,
    },
    { label: '推算公式', value: male ? '(父 + 母 + 13) ÷ 2' : '(父 + 母 − 13) ÷ 2', hint: 'CMH 法' },
    { label: '父母平均', value: `${((father + mother) / 2).toFixed(1)} cm` },
    {
      label: '影响因素',
      value: '遗传约占 70%',
      hint: '睡眠、蛋白质摄入、纵向运动影响剩余部分',
    },
    { label: '建议', value: '小学阶段每年长 5–7 cm 属正常', hint: '明显偏离时查骨龄，不要盲目补钙' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '遗传靶身高只表示基因潜力，实际身高受营养与作息影响',
}

export default logic
