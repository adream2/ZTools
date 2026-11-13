import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'type',
    label: '测量类型',
    type: 'select' as const,
    default: 'fasting',
    options: [
      { label: '空腹（≥8 小时）', value: 'fasting' },
      { label: '餐后 2 小时', value: 'after' },
      { label: '随机', value: 'random' },
    ],
  },
  { key: 'value', label: '血糖值（mmol/L）', type: 'number' as const, default: 5.4, min: 1, max: 40, step: 0.1 },
]

function classify(type: string, v: number): { name: string; advice: string; hint: string } {
  if (v < 3.9) {
    return { name: '低血糖', hint: '< 3.9 mmol/L', advice: '出现心慌手抖应立即补 15 g 糖，15 分钟后复测' }
  }
  if (type === 'fasting') {
    if (v < 6.1) return { name: '正常', hint: '< 6.1', advice: '保持饮食结构，每年复查' }
    if (v < 7.0) return { name: '空腹血糖受损', hint: '6.1–6.9', advice: '属于糖尿病前期，减重与运动可逆转' }
    return { name: '达到糖尿病诊断标准', hint: '≥ 7.0', advice: '需复查确认，尽快就诊内分泌科' }
  }
  if (type === 'after') {
    if (v < 7.8) return { name: '正常', hint: '< 7.8', advice: '餐后控制良好' }
    if (v < 11.1) return { name: '糖耐量减低', hint: '7.8–11.0', advice: '糖尿病前期，建议做 OGTT 确认' }
    return { name: '达到糖尿病诊断标准', hint: '≥ 11.1', advice: '需复查确认，尽快就诊' }
  }
  if (v < 11.1) return { name: '未达诊断阈值', hint: '< 11.1', advice: '随机血糖不能单独诊断，建议测空腹与餐后' }
  return { name: '达到糖尿病诊断标准', hint: '≥ 11.1', advice: '伴多饮多尿等症状时可确诊，尽快就诊' }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const type = String(values.type)
  const v = Number(values.value)
  if (!Number.isFinite(v) || v <= 0) return [{ label: '结果', value: '请输入血糖值', emphasis: true }]

  const level = classify(type, v)
  const mgdl = v * 18

  return [
    { label: '判读', value: level.name, emphasis: true, hint: `${v.toFixed(1)} mmol/L · ${level.hint}` },
    { label: '建议', value: level.advice },
    { label: '换算 mg/dL', value: mgdl.toFixed(0), hint: 'mmol/L × 18' },
    {
      label: '参考区间',
      value: type === 'fasting' ? '3.9–6.1' : type === 'after' ? '3.9–7.8' : '3.9–11.1',
      hint: '单位 mmol/L',
    },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '判读参考中国 2 型糖尿病防治指南，确诊需医生结合复查',
}

export default logic
