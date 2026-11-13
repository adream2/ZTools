import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'n', label: '试验次数 n', type: 'number' as const, default: 10, min: 1, max: 2000 },
  { key: 'p', label: '单次成功概率 p', type: 'number' as const, default: 0.5, min: 0, max: 1, step: 0.01 },
  { key: 'k', label: '成功次数 k', type: 'number' as const, default: 5, min: 0 },
]

/** Lanczos 近似 ln Γ(x)，用于大 n 时避免阶乘溢出 */
function lgamma(x: number): number {
  const cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2,
    -0.5395239384953e-5,
  ]
  let y = x
  let tmp = x + 5.5
  tmp -= (x + 0.5) * Math.log(tmp)
  let ser = 1.000000000190015
  for (const c of cof) {
    y += 1
    ser += c / y
  }
  return -tmp + Math.log((2.5066282746310005 * ser) / x)
}

const lnC = (n: number, k: number): number => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1)

export function binomialPmf(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0
  if (p <= 0) return k === 0 ? 1 : 0
  if (p >= 1) return k === n ? 1 : 0
  return Math.exp(lnC(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p))
}

const pct = (v: number): string => `${(v * 100).toFixed(4)}%`

function compute(values: Record<string, string | number>): CalcResult[] {
  const n = Math.round(Number(values.n))
  const p = Number(values.p)
  const k = Math.round(Number(values.k))

  if (!Number.isFinite(n) || n < 1 || n > 2000) return [{ label: '结果', value: 'n 需在 1–2000 之间', emphasis: true }]
  if (!Number.isFinite(p) || p < 0 || p > 1) return [{ label: '结果', value: 'p 需在 0–1 之间', emphasis: true }]
  if (!Number.isFinite(k) || k < 0) return [{ label: '结果', value: 'k 需为非负整数', emphasis: true }]

  if (k > n) {
    return [
      { label: '结果', value: 'k 不能大于 n', emphasis: true },
      { label: '提示', value: `${n} 次试验不可能成功 ${k} 次` },
    ]
  }

  let atMost = 0
  let atLeast = 0
  for (let i = 0; i <= n; i += 1) {
    const v = binomialPmf(n, p, i)
    if (i <= k) atMost += v
    if (i >= k) atLeast += v
  }

  const mean = n * p
  const variance = n * p * (1 - p)
  const mode = Math.min(n, Math.floor((n + 1) * p))

  return [
    { label: `恰好 ${k} 次 P(X=k)`, value: pct(binomialPmf(n, p, k)), emphasis: true, hint: `期望命中 ${mean.toFixed(2)} 次` },
    { label: `至多 ${k} 次 P(X≤k)`, value: pct(Math.min(1, atMost)) },
    { label: `至少 ${k} 次 P(X≥k)`, value: pct(Math.min(1, atLeast)) },
    { label: '期望 E(X)', value: mean.toFixed(4), hint: 'n × p' },
    { label: '方差 / 标准差', value: `${variance.toFixed(4)} / ${Math.sqrt(variance).toFixed(4)}` },
    { label: '最可能命中次数', value: String(mode), hint: '⌊(n+1)p⌋' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '用对数伽马函数计算，n 较大时也不会溢出',
}

export default logic
