import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'a', label: 'a（二次项）', type: 'number' as const, default: 1, step: 0.1 },
  { key: 'b', label: 'b（一次项）', type: 'number' as const, default: -3, step: 0.1 },
  { key: 'c', label: 'c（常数项）', type: 'number' as const, default: 2, step: 0.1 },
]

const fmt = (n: number): string => {
  if (!Number.isFinite(n)) return '—'
  const r = Number(n.toFixed(6))
  return Object.is(r, -0) ? '0' : String(r)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const a = Number(values.a)
  const b = Number(values.b)
  const c = Number(values.c)
  if (![a, b, c].every(Number.isFinite)) return [{ label: '结果', value: '请输入 a、b、c', emphasis: true }]

  if (a === 0) {
    if (b === 0) {
      return [{ label: '结果', value: c === 0 ? '任意实数都是解' : '无解（0 = c 不成立）', emphasis: true }]
    }
    return [
      { label: '退化为一次方程', value: `x = ${fmt(-c / b)}`, emphasis: true, hint: `a = 0 时 bx + c = 0` },
      { label: '方程', value: `${fmt(b)}x + ${fmt(c)} = 0` },
    ]
  }

  const d = b * b - 4 * a * c
  const vertexX = -b / (2 * a)
  const vertexY = a * vertexX * vertexX + b * vertexX + c

  const rows: CalcResult[] = [
    {
      label: '判别式 Δ',
      value: fmt(d),
      emphasis: true,
      hint: d > 0 ? '两个不相等实根' : d === 0 ? '两个相等实根' : '无实根，有一对共轭复根',
    },
  ]

  if (d >= 0) {
    const s = Math.sqrt(d)
    const x1 = (-b + s) / (2 * a)
    const x2 = (-b - s) / (2 * a)
    rows.push({ label: 'x₁', value: fmt(x1) })
    rows.push({ label: 'x₂', value: fmt(x2) })
    rows.push({ label: '两根之和', value: fmt(-b / a), hint: '韦达定理 −b/a' })
    rows.push({ label: '两根之积', value: fmt(c / a), hint: '韦达定理 c/a' })
  } else {
    const re = -b / (2 * a)
    const im = Math.sqrt(-d) / (2 * a)
    rows.push({ label: 'x₁', value: `${fmt(re)} + ${fmt(Math.abs(im))}i` })
    rows.push({ label: 'x₂', value: `${fmt(re)} − ${fmt(Math.abs(im))}i` })
  }

  rows.push({ label: '顶点', value: `(${fmt(vertexX)}, ${fmt(vertexY)})`, hint: a > 0 ? '开口向上，顶点是最小值' : '开口向下，顶点是最大值' })
  rows.push({ label: '对称轴', value: `x = ${fmt(vertexX)}` })
  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '系数可以是小数，结果保留 6 位小数',
}

export default logic
