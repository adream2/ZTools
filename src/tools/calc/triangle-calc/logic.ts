import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'a', label: '边 a', type: 'number' as const, default: 3, min: 0, step: 0.1 },
  { key: 'b', label: '边 b', type: 'number' as const, default: 4, min: 0, step: 0.1 },
  { key: 'c', label: '边 c', type: 'number' as const, default: 5, min: 0, step: 0.1 },
]

const toDeg = (rad: number): number => (rad * 180) / Math.PI

function compute(values: Record<string, string | number>): CalcResult[] {
  const a = Number(values.a)
  const b = Number(values.b)
  const c = Number(values.c)
  if (![a, b, c].every((n) => Number.isFinite(n) && n > 0)) {
    return [{ label: '结果', value: '三条边都要是正数', emphasis: true }]
  }
  if (a + b <= c || a + c <= b || b + c <= a) {
    return [{ label: '结果', value: '这三条边构不成三角形', emphasis: true, hint: '任意两边之和必须大于第三边' }]
  }

  const s = (a + b + c) / 2
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))

  const angleA = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)))
  const angleB = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)))
  const angleC = 180 - angleA - angleB

  const longest = Math.max(angleA, angleB, angleC)
  const type = Math.abs(longest - 90) < 0.05 ? '直角三角形' : longest > 90 ? '钝角三角形' : '锐角三角形'
  const special =
    Math.abs(a - b) < 1e-9 && Math.abs(b - c) < 1e-9
      ? '等边'
      : Math.abs(a - b) < 1e-9 || Math.abs(a - c) < 1e-9 || Math.abs(b - c) < 1e-9
        ? '等腰'
        : '不等边'

  return [
    { label: '面积', value: area.toFixed(4), emphasis: true, hint: `${type} · ${special}` },
    { label: '周长', value: (a + b + c).toFixed(4) },
    { label: '角 A（对边 a）', value: `${angleA.toFixed(2)}°` },
    { label: '角 B（对边 b）', value: `${angleB.toFixed(2)}°` },
    { label: '角 C（对边 c）', value: `${angleC.toFixed(2)}°` },
    { label: '内切圆半径', value: (area / s).toFixed(4), hint: 'r = 面积 / 半周长' },
    { label: '外接圆半径', value: ((a * b * c) / (4 * area)).toFixed(4), hint: 'R = abc / 4面积' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '输入三边即可，无需知道角度',
}

export default logic
