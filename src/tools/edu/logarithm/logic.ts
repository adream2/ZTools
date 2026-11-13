import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'x', label: '真数 x', type: 'number' as const, default: 1000, min: 0, step: 1 },
  {
    key: 'base',
    label: '底数',
    type: 'select' as const,
    default: 10,
    options: [
      { label: '10（常用对数 lg）', value: 10 },
      { label: '2（二进制）', value: 2 },
      { label: 'e（自然对数 ln）', value: Math.E },
      { label: '3', value: 3 },
    ],
  },
]

const fmt = (n: number): string => {
  if (!Number.isFinite(n)) return '—'
  const r = Number(n.toFixed(8))
  return Object.is(r, -0) ? '0' : String(r)
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const x = Number(values.x)
  const base = Number(values.base)
  if (!Number.isFinite(x) || x <= 0) return [{ label: '结果', value: '真数必须大于 0', emphasis: true }]
  if (!Number.isFinite(base) || base <= 0 || base === 1) return [{ label: '结果', value: '底数必须大于 0 且不等于 1', emphasis: true }]

  const value = Math.log(x) / Math.log(base)

  return [
    { label: `log${base === Math.E ? 'ₑ' : base}(${fmt(x)})`, value: fmt(value), emphasis: true, hint: `${base}^${fmt(value)} = ${fmt(x)}` },
    { label: '自然对数 ln x', value: fmt(Math.log(x)) },
    { label: '常用对数 lg x', value: fmt(Math.log10(x)) },
    { label: '二进制对数 log₂ x', value: fmt(Math.log2(x)) },
    { label: '倒数 1/logₐx', value: fmt(1 / value), hint: '等于 logₓa' },
    { label: '换底公式', value: `logₐx = ln x / ln a = ${fmt(Math.log(x))} / ${fmt(Math.log(base))}` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '结果保留 8 位小数，只支持实数范围',
}

export default logic
