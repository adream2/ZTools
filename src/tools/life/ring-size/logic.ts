import type { CalcLogic, CalcResult } from '@/components/templates/types'

/** 美码 → 内周长（mm），按常见对照表取近似值 */
const US: Array<[number, number]> = [
  [4, 46.8],
  [4.5, 48.0],
  [5, 49.3],
  [5.5, 50.6],
  [6, 51.9],
  [6.5, 53.1],
  [7, 54.4],
  [7.5, 55.7],
  [8, 57.0],
  [8.5, 58.3],
  [9, 59.5],
  [9.5, 60.8],
  [10, 62.1],
  [10.5, 63.4],
  [11, 64.6],
  [11.5, 65.9],
  [12, 67.2],
]

const FIELDS = [
  {
    key: 'mode',
    label: '量的方式',
    type: 'select' as const,
    default: 'circumference',
    options: [
      { label: '内周长（mm）', value: 'circumference' },
      { label: '内直径（mm）', value: 'diameter' },
    ],
  },
  { key: 'value', label: '实测值（mm）', type: 'number' as const, default: 54, min: 30, max: 80, step: 0.1 },
]

function usOf(circ: number): { size: number; diff: number } {
  let best = US[0]!
  for (const row of US) if (Math.abs(row[1] - circ) < Math.abs(best[1] - circ)) best = row
  return { size: best[0], diff: Number((circ - best[1]).toFixed(2)) }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = Number(values.value)
  if (!Number.isFinite(raw) || raw <= 0) return [{ label: '结果', value: '请输入实测值', emphasis: true }]

  const circ = String(values.mode) === 'diameter' ? raw * Math.PI : raw
  if (circ < 36 || circ > 76) return [{ label: '结果', value: '周长超出常见戒指范围（36–76 mm）', emphasis: true }]

  const chinese = Math.round(circ - 40)
  const us = usOf(circ)

  return [
    { label: '中国号数', value: `${chinese} 号`, emphasis: true, hint: `周长 ${circ.toFixed(1)} mm` },
    { label: '内直径', value: `${(circ / Math.PI).toFixed(1)} mm` },
    { label: '欧码', value: `${Math.round(circ)}`, hint: '欧洲以周长毫米数标号' },
    { label: '美码', value: `${us.size}`, hint: us.diff >= 0 ? `比标准大 ${us.diff} mm` : `比标准小 ${Math.abs(us.diff)} mm` },
    { label: '宽版建议', value: `${chinese + 1} 号`, hint: '戒圈宽 5mm 以上加半到一号' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '对照表为通用近似值，各品牌手寸可能有半号差异',
}

export default logic
