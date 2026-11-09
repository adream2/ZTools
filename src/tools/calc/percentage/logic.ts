import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'mode',
    label: '计算方式',
    type: 'select' as const,
    default: 'ratio',
    options: [
      { label: 'A 是 B 的百分之几', value: 'ratio' },
      { label: 'B 的 P% 是多少', value: 'of' },
      { label: '从 A 到 B 的变化率', value: 'change' },
      { label: 'A 占总量 B 的比例', value: 'share' },
    ],
  },
  { key: 'a', label: 'A', type: 'number' as const, default: 25 },
  { key: 'b', label: 'B', type: 'number' as const, default: 200 },
  { key: 'p', label: 'P（百分比）', type: 'number' as const, default: 15, hint: '仅第二种方式使用' },
]

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return String(Number(n.toFixed(6)))
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const a = Number(values.a)
  const b = Number(values.b)
  const p = Number(values.p)
  const mode = String(values.mode)

  if (mode === 'of') {
    const result = (b * p) / 100
    return [
      { label: `${b} 的 ${p}%`, value: fmt(result), emphasis: true },
      { label: '加 P%', value: fmt(b * (1 + p / 100)), hint: `${b} + ${p}%` },
      { label: '减 P%', value: fmt(b * (1 - p / 100)), hint: `${b} − ${p}%` },
    ]
  }

  if (b === 0) {
    return [{ label: '结果', value: 'B 不能为 0', emphasis: true }]
  }

  if (mode === 'change') {
    const change = ((b - a) / a) * 100
    return [
      {
        label: '变化率',
        value: `${change > 0 ? '+' : ''}${fmt(change)}%`,
        emphasis: true,
        hint: change >= 0 ? '增长' : '下降',
      },
      { label: '绝对差', value: fmt(b - a) },
      { label: '变化倍数', value: `${fmt(b / a)} 倍` },
    ]
  }

  if (mode === 'share') {
    const share = (a / b) * 100
    return [
      { label: '占比', value: `${fmt(share)}%`, emphasis: true },
      { label: '剩余', value: `${fmt(100 - share)}%` },
      { label: '绝对差', value: fmt(b - a) },
    ]
  }

  const ratio = (a / b) * 100
  return [
    { label: 'A 是 B 的', value: `${fmt(ratio)}%`, emphasis: true },
    { label: 'B 是 A 的', value: a === 0 ? '—' : `${fmt((b / a) * 100)}%` },
    { label: 'A 与 B 的差', value: fmt(a - b) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '结果最多保留 6 位小数，自动去掉末尾的 0',
}

export default logic
