import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'matrix',
    label: '矩阵（每行一行）',
    type: 'textarea' as const,
    default: '2 1 0\n1 3 1\n0 1 2',
  },
]

export function parseMatrix(raw: string): number[][] {
  const rows = raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[\s,]+/).filter(Boolean).map(Number))

  if (!rows.length) throw new Error('矩阵为空')
  if (rows.length < 2 || rows.length > 5) throw new Error('只支持 2–5 阶方阵')
  const width = rows[0]!.length
  if (rows.some((r) => r.length !== width)) throw new Error('每行的数字个数不一致')
  if (width !== rows.length) throw new Error(`这是 ${rows.length}×${width} 矩阵，不是方阵`)
  if (rows.some((r) => r.some((n) => !Number.isFinite(n)))) throw new Error('矩阵中有无法解析的数字')
  return rows
}

/** Bareiss 无分数消元，整数矩阵能得到精确整数行列式 */
export function determinant(input: number[][]): number {
  const n = input.length
  const a = input.map((r) => r.slice())
  let sign = 1
  let prev = 1

  for (let k = 0; k < n - 1; k += 1) {
    if (a[k]![k] === 0) {
      let swap = -1
      for (let i = k + 1; i < n; i += 1) {
        if (a[i]![k] !== 0) {
          swap = i
          break
        }
      }
      if (swap < 0) return 0
      const tmp = a[k]!
      a[k] = a[swap]!
      a[swap] = tmp
      sign = -sign
    }
    for (let i = k + 1; i < n; i += 1) {
      for (let j = k + 1; j < n; j += 1) {
        a[i]![j] = (a[i]![j]! * a[k]![k]! - a[i]![k]! * a[k]![j]!) / prev
      }
    }
    prev = a[k]![k]!
  }

  return sign * a[n - 1]![n - 1]!
}

const fmt = (n: number): string => {
  const r = Number(n.toFixed(6))
  return Object.is(r, -0) ? '0' : String(r)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  let matrix: number[][]
  try {
    matrix = parseMatrix(String(values.matrix ?? ''))
  } catch (e) {
    return [{ label: '结果', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  const det = determinant(matrix)
  const n = matrix.length
  const trace = matrix.reduce((sum, row, i) => sum + row[i]!, 0)

  return [
    {
      label: '行列式',
      value: fmt(det),
      emphasis: true,
      hint: Math.abs(det) < 1e-12 ? '矩阵奇异，不可逆' : '矩阵可逆',
    },
    { label: '阶数', value: `${n} × ${n}` },
    { label: '迹', value: fmt(trace), hint: '主对角线元素之和' },
    { label: '是否可逆', value: Math.abs(det) < 1e-12 ? '不可逆' : '可逆', hint: '行列式不为 0 才可逆' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '整数矩阵用 Bareiss 算法，结果精确；小数矩阵为浮点近似',
}

export default logic
