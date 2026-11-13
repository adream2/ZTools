import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'shares', label: '原持仓股数', type: 'number' as const, default: 1000, min: 0, step: 100 },
  { key: 'cost', label: '原成本价（元）', type: 'number' as const, default: 12, min: 0, step: 0.01 },
  { key: 'price', label: '当前价（元）', type: 'number' as const, default: 8, min: 0, step: 0.01 },
  { key: 'add', label: '加仓股数', type: 'number' as const, default: 1000, min: 0, step: 100 },
]

const money = (n: number): string => `${n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const shares = Number(values.shares)
  const cost = Number(values.cost)
  const price = Number(values.price)
  const add = Number(values.add)

  if (![shares, cost, price, add].every((n) => Number.isFinite(n) && n >= 0)) {
    return [{ label: '结果', value: '请输入股数与价格', emphasis: true }]
  }
  if (shares + add <= 0) return [{ label: '结果', value: '持仓与加仓数量不能都为 0', emphasis: true }]

  const totalShares = shares + add
  const newCost = (shares * cost + add * price) / totalShares
  const oldLoss = (price - cost) * shares
  const newLoss = (price - newCost) * totalShares
  const rebound = price > 0 ? ((newCost - price) / price) * 100 : 0

  const rows: CalcResult[] = [
    {
      label: '加仓后成本',
      value: money(newCost),
      emphasis: true,
      hint: add > 0 ? `摊薄 ${(((cost - newCost) / cost) * 100).toFixed(2)}%` : '未加仓',
    },
    { label: '持仓总量', value: `${totalShares.toLocaleString('zh-CN')} 股` },
    { label: '当前市值', value: money(totalShares * price) },
    { label: '浮动盈亏', value: money(newLoss), hint: '加仓前为 ' + money(oldLoss) },
    { label: '回本需涨', value: `${rebound.toFixed(2)}%` },
    { label: '加权投入', value: money(shares * cost + add * price) },
  ]

  if (add > 0 && price > 0) {
    rows.push({
      label: '等额补仓参考',
      value: money((shares * cost + shares * price) / (shares * 2)),
      hint: '按同样的股数再补一次的成本',
    })
  }

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '未计入佣金、印花税与滑点',
}

export default logic
