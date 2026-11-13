import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'a', label: 'a（三次项）', type: 'number' as const, default: 1, step: 0.1 },
  { key: 'b', label: 'b（二次项）', type: 'number' as const, default: -6, step: 0.1 },
  { key: 'c', label: 'c（一次项）', type: 'number' as const, default: 11, step: 0.1 },
  { key: 'd', label: 'd（常数项）', type: 'number' as const, default: -6, step: 0.1 },
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
  const d = Number(values.d)
  if (![a, b, c, d].every(Number.isFinite)) return [{ label: '结果', value: '请输入四个系数', emphasis: true }]

  if (a === 0) {
    return [
      {
        label: '结果',
        value: 'a = 0，这是二次方程',
        emphasis: true,
        hint: '改用「一元二次方程」工具',
      },
    ]
  }

  const p = (3 * a * c - b * b) / (3 * a * a)
  const q = (2 * b ** 3 - 9 * a * b * c + 27 * a * a * d) / (27 * a ** 3)
  const delta = (q / 2) ** 2 + (p / 3) ** 3
  const offset = -b / (3 * a)

  const rows: CalcResult[] = [
    { label: '判别式 Δ', value: fmt(delta), emphasis: true, hint: delta > 1e-9 ? '一个实根' : delta < -1e-9 ? '三个实根' : '有重根' },
  ]

  if (delta > 1e-9) {
    const sq = Math.sqrt(delta)
    const u = Math.cbrt(-q / 2 + sq)
    const v = Math.cbrt(-q / 2 - sq)
    const re = -(u + v) / 2 + offset
    const im = (Math.sqrt(3) / 2) * Math.abs(u - v)
    rows.push({ label: '实根 x₁', value: fmt(u + v + offset) })
    rows.push({ label: '复根 x₂', value: `${fmt(re)} + ${fmt(im)}i` })
    rows.push({ label: '复根 x₃', value: `${fmt(re)} − ${fmt(im)}i` })
    rows.push({ label: '实根个数', value: '1 个' })
  } else if (delta < -1e-9) {
    const r = 2 * Math.sqrt(-p / 3)
    const arg = Math.max(-1, Math.min(1, (3 * q) / (2 * p) * Math.sqrt(-3 / p)))
    const phi = Math.acos(arg) / 3
    const roots = [0, 1, 2].map((k) => r * Math.cos(phi - (2 * Math.PI * k) / 3) + offset)
    roots.sort((x, y) => x - y)
    rows.push({ label: 'x₁', value: fmt(roots[0]!) })
    rows.push({ label: 'x₂', value: fmt(roots[1]!) })
    rows.push({ label: 'x₃', value: fmt(roots[2]!) })
    rows.push({ label: '实根个数', value: '3 个' })
  } else {
    const u = Math.cbrt(-q / 2)
    if (Math.abs(p) < 1e-12 && Math.abs(q) < 1e-12) {
      rows.push({ label: '三重根', value: fmt(offset) })
      rows.push({ label: '实根个数', value: '1 个（三重）' })
    } else {
      rows.push({ label: 'x₁（二重根）', value: fmt(2 * u + offset) })
      rows.push({ label: 'x₂', value: fmt(-u + offset) })
      rows.push({ label: '实根个数', value: '2 个（其中一个是重根）' })
    }
  }

  rows.push({ label: '三根之和', value: fmt(-b / a), hint: '韦达定理 −b/a' })
  rows.push({ label: '三根之积', value: fmt(-d / a), hint: '韦达定理 −d/a' })
  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '系数可为小数；结果为数值近似，不是根式',
}

export default logic
