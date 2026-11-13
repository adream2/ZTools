import type { CalcLogic, CalcResult } from '@/components/templates/types'
import { countAtoms } from '../molar-mass/logic'

const FIELDS = [
  {
    key: 'equation',
    label: '化学方程式',
    type: 'text' as const,
    default: 'C3H8 + O2 -> CO2 + H2O',
    hint: '用 -> 或 = 分隔两侧',
  },
]

/* ---------- 分数运算 ---------- */
type F = [number, number]

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function fr(n: number, d = 1): F {
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  return [n / g, d / g]
}

const fsub = (a: F, b: F): F => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const fmul = (a: F, b: F): F => fr(a[0] * b[0], a[1] * b[1])
const fdiv = (a: F, b: F): F => {
  if (b[0] === 0) throw new Error('分母为 0')
  return fr(a[0] * b[1], a[1] * b[0])
}
const fneg = (a: F): F => fr(-a[0], a[1])

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

/** 高斯消元求零空间基（分数精确计算） */
function nullSpace(matrix: F[][], cols: number): F[][] {
  const m = matrix.map((row) => row.slice())
  const pivots: number[] = []
  let row = 0

  for (let col = 0; col < cols && row < m.length; col += 1) {
    let pick = -1
    for (let r = row; r < m.length; r += 1) {
      if (m[r]![col]![0] !== 0) {
        pick = r
        break
      }
    }
    if (pick < 0) continue

    const tmp = m[row]!
    m[row] = m[pick]!
    m[pick] = tmp

    const pivot = m[row]![col]!
    for (let c = 0; c < cols; c += 1) m[row]![c] = fdiv(m[row]![c]!, pivot)

    for (let r = 0; r < m.length; r += 1) {
      if (r === row) continue
      const factor = m[r]![col]!
      if (factor[0] === 0) continue
      for (let c = 0; c < cols; c += 1) m[r]![c] = fsub(m[r]![c]!, fmul(factor, m[row]![c]!))
    }

    pivots.push(col)
    row += 1
  }

  const free: number[] = []
  for (let c = 0; c < cols; c += 1) if (!pivots.includes(c)) free.push(c)

  return free.map((fc) => {
    const v: F[] = new Array(cols).fill([0, 1])
    v[fc] = [1, 1]
    pivots.forEach((pc, i) => {
      v[pc] = fneg(m[i]![fc]!)
    })
    return v
  })
}

interface Term {
  coefficient: number
  formula: string
}

function parseTerm(raw: string): Term {
  const text = raw.trim()
  const m = /^(\d+)?\s*([A-Za-z0-9()]+)$/.exec(text)
  if (!m) throw new Error(`看不懂这一项：${text}`)
  return { coefficient: m[1] ? Number(m[1]) : 1, formula: m[2]! }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.equation ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入方程式', emphasis: true }]

  const split = raw.split(/\s*(?:->|→|=|⟶)\s*/)
  if (split.length !== 2) return [{ label: '结果', value: '需要用 -> 或 = 分隔反应物与生成物', emphasis: true }]

  let left: Term[]
  let right: Term[]
  try {
    left = split[0]!.split('+').map(parseTerm)
    right = split[1]!.split('+').map(parseTerm)
  } catch (e) {
    return [{ label: '结果', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  const terms = [...left, ...right]
  if (terms.length > 8) return [{ label: '结果', value: '最多支持 8 个物质', emphasis: true }]

  const atomLists = terms.map((t) => {
    try {
      return countAtoms(t.formula)
    } catch (e) {
      throw new Error(`${t.formula}：${e instanceof Error ? e.message : String(e)}`)
    }
  })

  const elements = [...new Set(atomLists.flatMap((a) => Object.keys(a)))]
  if (elements.length > 10) return [{ label: '结果', value: '元素种类过多，超过 10 种不支持', emphasis: true }]

  const matrix: F[][] = elements.map((el) => {
    const row: F[] = new Array(terms.length).fill(0).map(() => [0, 1] as F)
    atomLists.forEach((atoms, i) => {
      const count = atoms[el] ?? 0
      const sign = i < left.length ? -1 : 1
      row[i] = fr(sign * count)
    })
    return row
  })

  const basis = nullSpace(matrix, terms.length)
  if (basis.length !== 1) {
    return [
      {
        label: '结果',
        value: basis.length === 0 ? '无解，两边元素不可能守恒' : '存在多组配比，无法唯一确定',
        emphasis: true,
      },
      { label: '元素', value: elements.join('、') },
    ]
  }

  const vec = basis[0]!
  if (vec.every((v) => v[0] === 0)) return [{ label: '结果', value: '只得到平凡解，检查方程式', emphasis: true }]

  let scale = 1
  for (const v of vec) scale = lcm(scale, v[1])
  const ints = vec.map((v) => (v[0] * scale) / v[1])
  const common = ints.reduce((g, n) => gcd(g, n), 0)
  let coeffs = ints.map((n) => n / common)

  if (coeffs.every((n) => n < 0)) coeffs = coeffs.map((n) => -n)
  if (coeffs.some((n) => n < 0)) {
    return [{ label: '结果', value: '系数方向不一致，检查反应物与生成物是否写反', emphasis: true }]
  }

  const leftText = left.map((t, i) => `${coeffs[i] === 1 ? '' : coeffs[i]}${t.formula}`).join(' + ')
  const rightText = right
    .map((t, i) => `${coeffs[left.length + i] === 1 ? '' : coeffs[left.length + i]}${t.formula}`)
    .join(' + ')

  return [
    { label: '配平结果', value: `${leftText} → ${rightText}`, emphasis: true },
    { label: '系数', value: coeffs.join(' : '), hint: `共 ${terms.length} 个物质` },
    { label: '元素种类', value: `${elements.length} 种：${elements.join('、')}` },
    { label: '守恒检查', value: checkText(elements, atomLists, coeffs, left.length) },
  ]
}

function checkText(
  elements: string[],
  atomLists: Array<Record<string, number>>,
  coeffs: number[],
  leftCount: number,
): string {
  return elements
    .map((el) => {
      const l = atomLists.slice(0, leftCount).reduce((sum, a, i) => sum + (a[el] ?? 0) * coeffs[i]!, 0)
      const r = atomLists.slice(leftCount).reduce((sum, a, i) => sum + (a[el] ?? 0) * coeffs[leftCount + i]!, 0)
      return `${el}:${l}${l === r ? '=' : '≠'}${r}`
    })
    .join('，')
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '系数由元素守恒算出；方程式里原来的数字会被忽略',
}

export default logic
