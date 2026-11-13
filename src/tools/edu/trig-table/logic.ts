import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'angle', label: '角度值', type: 'number' as const, default: 30, step: 1 },
  {
    key: 'unit',
    label: '单位',
    type: 'select' as const,
    default: 'deg',
    options: [
      { label: '度（°）', value: 'deg' },
      { label: '弧度（rad）', value: 'rad' },
    ],
  },
]

/** 常见特殊角的精确值 */
const EXACT: Record<number, { sin: string; cos: string; tan: string }> = {
  0: { sin: '0', cos: '1', tan: '0' },
  30: { sin: '1/2', cos: '√3/2', tan: '√3/3' },
  45: { sin: '√2/2', cos: '√2/2', tan: '1' },
  60: { sin: '√3/2', cos: '1/2', tan: '√3' },
  90: { sin: '1', cos: '0', tan: '不存在' },
  120: { sin: '√3/2', cos: '−1/2', tan: '−√3' },
  135: { sin: '√2/2', cos: '−√2/2', tan: '−1' },
  150: { sin: '1/2', cos: '−√3/2', tan: '−√3/3' },
  180: { sin: '0', cos: '−1', tan: '0' },
  210: { sin: '−1/2', cos: '−√3/2', tan: '√3/3' },
  225: { sin: '−√2/2', cos: '−√2/2', tan: '1' },
  240: { sin: '−√3/2', cos: '−1/2', tan: '√3' },
  270: { sin: '−1', cos: '0', tan: '不存在' },
  300: { sin: '−√3/2', cos: '1/2', tan: '−√3' },
  315: { sin: '−√2/2', cos: '√2/2', tan: '−1' },
  330: { sin: '−1/2', cos: '√3/2', tan: '−√3/3' },
  360: { sin: '0', cos: '1', tan: '0' },
}

const round = (n: number): string => {
  if (!Number.isFinite(n)) return '不存在'
  const r = Number(n.toFixed(6))
  return Object.is(r, -0) ? '0' : String(r)
}

function quadrantOf(deg: number): string {
  const d = ((deg % 360) + 360) % 360
  if (d === 0 || d === 90 || d === 180 || d === 270) return '轴线上'
  if (d < 90) return '第一象限'
  if (d < 180) return '第二象限'
  if (d < 270) return '第三象限'
  return '第四象限'
}

function referenceAngle(deg: number): number {
  const d = ((deg % 360) + 360) % 360
  if (d <= 90) return d
  if (d <= 180) return 180 - d
  if (d <= 270) return d - 180
  return 360 - d
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const input = Number(values.angle)
  if (!Number.isFinite(input)) return [{ label: '结果', value: '请输入角度值', emphasis: true }]

  const isDeg = String(values.unit) !== 'rad'
  const deg = isDeg ? input : (input * 180) / Math.PI
  const rad = isDeg ? (input * Math.PI) / 180 : input

  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const tan = Math.abs(cos) < 1e-12 ? Number.NaN : sin / cos

  const normalized = ((Math.round(deg) % 360) + 360) % 360
  const exact = Number.isInteger(deg) ? EXACT[normalized] : undefined

  const rows: CalcResult[] = [
    {
      label: 'sin',
      value: round(sin),
      emphasis: true,
      hint: exact ? `精确值 ${exact.sin}` : undefined,
    },
    { label: 'cos', value: round(cos), hint: exact ? `精确值 ${exact.cos}` : undefined },
    { label: 'tan', value: round(tan), hint: exact ? `精确值 ${exact.tan}` : 'tan = sin / cos' },
    { label: 'cot', value: round(1 / tan), hint: '1 / tan' },
    { label: '弧度', value: round(rad), hint: `${round(deg)}°` },
    { label: '象限', value: quadrantOf(deg), hint: `参考角 ${round(referenceAngle(deg))}°` },
  ]

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '结果保留 6 位小数，特殊角会额外给出精确值',
}

export default logic
