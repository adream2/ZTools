import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'cost', label: '成本（元）', type: 'number' as const, default: 60, min: 0, step: 1 },
  { key: 'price', label: '售价（元）', type: 'number' as const, default: 100, min: 0, step: 1 },
  { key: 'target', label: '目标毛利率 %', type: 'number' as const, default: 40, min: 0, max: 99, step: 1 },
]

const money = (n: number): string => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const cost = Number(values.cost)
  const price = Number(values.price)
  const target = Math.min(99, Math.max(0, Number(values.target) || 0))

  if (!Number.isFinite(cost) || !Number.isFinite(price) || cost < 0 || price < 0) {
    return [{ label: '结果', value: '请输入成本与售价', emphasis: true }]
  }

  const profit = price - cost
  const margin = price > 0 ? (profit / price) * 100 : 0
  const markup = cost > 0 ? (profit / cost) * 100 : 0
  const targetPrice = cost / (1 - target / 100)

  const rows: CalcResult[] = [
    { label: '毛利', value: money(profit), emphasis: true, hint: profit < 0 ? '亏本，售价低于成本' : `毛利率 ${margin.toFixed(2)}%` },
    { label: '毛利率', value: `${margin.toFixed(2)}%`, hint: '毛利 / 售价' },
    { label: '加价率', value: `${markup.toFixed(2)}%`, hint: '毛利 / 成本' },
    { label: `目标 ${target}% 的售价`, value: money(targetPrice), hint: `成本 ÷ (1 − ${target}%)` },
  ]

  if (price > 0) {
    rows.push({
      label: '距目标',
      value: price >= targetPrice ? `已达标，可降 ${money(price - targetPrice)}` : `需涨 ${money(targetPrice - price)}`,
    })
  }

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '未计入运费、平台佣金与退货损耗',
}

export default logic
