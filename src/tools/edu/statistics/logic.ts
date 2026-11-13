import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'data',
    label: '数据（逗号 / 空格 / 换行分隔）',
    type: 'textarea' as const,
    default: '12, 15, 18, 18, 21, 25, 30',
    hint: '支持小数与负数',
  },
]

const fmt = (n: number): string => {
  if (!Number.isFinite(n)) return '—'
  const r = Number(n.toFixed(4))
  return Object.is(r, -0) ? '0' : String(r)
}

const logic: GeneratorLogic = {
  FIELDS,
  generate: (values) => {
    const list = String(values.data ?? '')
      .split(/[^0-9.eE+-]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n))

    if (!list.length) return [{ label: '提示', value: '没有解析到数字' }]
    if (list.length > 10000) return [{ label: '提示', value: '数据量太大，请分批计算' }]

    const n = list.length
    const sorted = [...list].sort((a, b) => a - b)
    const sum = list.reduce((a, b) => a + b, 0)
    const mean = sum / n
    const median = n % 2 ? sorted[(n - 1) / 2]! : (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2
    const min = sorted[0]!
    const max = sorted[n - 1]!
    const varianceP = list.reduce((a, b) => a + (b - mean) ** 2, 0) / n
    const varianceS = n > 1 ? list.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1) : 0

    const counts = new Map<number, number>()
    for (const v of list) counts.set(v, (counts.get(v) ?? 0) + 1)
    const top = Math.max(...counts.values())
    const modes = top > 1 ? [...counts.entries()].filter(([, c]) => c === top).map(([v]) => v) : []

    const q = (p: number): number => {
      const pos = (n - 1) * p
      const lo = Math.floor(pos)
      const hi = Math.ceil(pos)
      return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (pos - lo)
    }

    return [
      { label: '数据个数', value: String(n) },
      { label: '总和', value: fmt(sum) },
      { label: '平均数', value: fmt(mean) },
      { label: '中位数', value: fmt(median) },
      { label: '众数', value: modes.length ? modes.join('、') : '无重复值' },
      { label: '最小值 / 最大值', value: `${fmt(min)} / ${fmt(max)}` },
      { label: '极差', value: fmt(max - min) },
      { label: '样本方差 (n−1)', value: fmt(varianceS) },
      { label: '总体方差 (n)', value: fmt(varianceP) },
      { label: '样本标准差', value: fmt(Math.sqrt(varianceS)) },
      { label: '总体标准差', value: fmt(Math.sqrt(varianceP)) },
      { label: '四分位数 Q1 / Q3', value: `${fmt(q(0.25))} / ${fmt(q(0.75))}` },
    ]
  },
  resultLabel: '统计结果',
  note: '按输入顺序解析，非数字字符自动当作分隔符',
}

export default logic
