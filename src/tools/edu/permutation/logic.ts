import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'n', label: '总数 n', type: 'number' as const, default: 6, min: 0, max: 200 },
  { key: 'r', label: '取出 r', type: 'number' as const, default: 3, min: 0, max: 200 },
]

function factorial(n: number): bigint {
  let out = 1n
  for (let i = 2n; i <= BigInt(n); i += 1n) out *= i
  return out
}

function perm(n: number, r: number): bigint {
  let out = 1n
  for (let i = 0; i < r; i += 1) out *= BigInt(n - i)
  return out
}

function comb(n: number, r: number): bigint {
  const k = Math.min(r, n - r)
  let out = 1n
  for (let i = 0; i < k; i += 1) out = (out * BigInt(n - i)) / BigInt(i + 1)
  return out
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const n = Math.round(Number(values.n))
  const r = Math.round(Number(values.r))
  if (!Number.isFinite(n) || !Number.isFinite(r) || n < 0 || r < 0) {
    return [{ label: '结果', value: 'n 与 r 都要是非负整数', emphasis: true }]
  }
  if (r > n) return [{ label: '结果', value: 'r 不能大于 n', emphasis: true }]

  const p = perm(n, r)
  const c = comb(n, r)

  return [
    { label: `A(${n},${r}) 排列`, value: p.toLocaleString('en-US'), emphasis: true, hint: '讲究顺序' },
    { label: `C(${n},${r}) 组合`, value: c.toLocaleString('en-US'), hint: '不讲顺序' },
    { label: `${n}! 阶乘`, value: factorial(n).toLocaleString('en-US') },
    { label: `${r}! 阶乘`, value: factorial(r).toLocaleString('en-US') },
    { label: '可重复排列', value: n ** r > Number.MAX_SAFE_INTEGER ? `${n}^${r}` : String(n ** r), hint: `每位都有 ${n} 种选择` },
    { label: '关系', value: `A(${n},${r}) = C(${n},${r}) × ${r}!`, hint: '排列 = 组合 × 排列方式' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'n 上限 200，再大阶乘会拖慢渲染',
}

export default logic
