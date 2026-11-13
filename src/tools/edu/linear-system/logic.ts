import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'a1', label: 'a₁', type: 'number' as const, default: 1, step: 0.1 },
  { key: 'b1', label: 'b₁', type: 'number' as const, default: 1, step: 0.1 },
  { key: 'c1', label: 'c₁', type: 'number' as const, default: 3, step: 0.1 },
  { key: 'a2', label: 'a₂', type: 'number' as const, default: 1, step: 0.1 },
  { key: 'b2', label: 'b₂', type: 'number' as const, default: -1, step: 0.1 },
  { key: 'c2', label: 'c₂', type: 'number' as const, default: 1, step: 0.1 },
]

const fmt = (n: number): string => {
  const r = Number(n.toFixed(6))
  return Object.is(r, -0) ? '0' : String(r)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const a1 = Number(values.a1)
  const b1 = Number(values.b1)
  const c1 = Number(values.c1)
  const a2 = Number(values.a2)
  const b2 = Number(values.b2)
  const c2 = Number(values.c2)
  if (![a1, b1, c1, a2, b2, c2].every(Number.isFinite)) {
    return [{ label: '结果', value: '请填写六个系数', emphasis: true }]
  }

  const det = a1 * b2 - a2 * b1
  const detX = c1 * b2 - c2 * b1
  const detY = a1 * c2 - a2 * c1

  if (Math.abs(det) < 1e-12) {
    const sameLine = Math.abs(a1 * c2 - a2 * c1) < 1e-12 && Math.abs(b1 * c2 - b2 * c1) < 1e-12
    return [
      {
        label: '结果',
        value: sameLine ? '无穷多解' : '无解',
        emphasis: true,
        hint: sameLine ? '两个方程表示同一条直线' : '两条直线平行',
      },
      { label: '系数行列式', value: '0' },
      { label: '方程组', value: `${fmt(a1)}x + ${fmt(b1)}y = ${fmt(c1)}；${fmt(a2)}x + ${fmt(b2)}y = ${fmt(c2)}` },
    ]
  }

  const x = detX / det
  const y = detY / det

  return [
    { label: '解', value: `x = ${fmt(x)}, y = ${fmt(y)}`, emphasis: true, hint: '两直线的交点' },
    { label: 'x', value: fmt(x) },
    { label: 'y', value: fmt(y) },
    { label: '系数行列式', value: fmt(det), hint: '不为 0 时只有唯一解' },
    {
      label: '验算',
      value: `${fmt(a1 * x + b1 * y)} / ${fmt(a2 * x + b2 * y)}`,
      hint: `应分别等于 ${fmt(c1)} 与 ${fmt(c2)}`,
    },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '形如 a₁x + b₁y = c₁，系数可以是小数',
}

export default logic
