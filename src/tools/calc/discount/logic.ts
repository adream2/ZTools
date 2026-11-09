import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'price', label: '原价（元）', type: 'number' as const, default: 299, min: 0, step: 1 },
  { key: 'discount', label: '折扣（如 8.5 表示 85 折）', type: 'number' as const, default: 8.5, min: 0, max: 10, step: 0.1 },
  { key: 'second', label: '折上折（可选）', type: 'number' as const, default: 0, min: 0, max: 10, step: 0.1 },
  { key: 'threshold', label: '满（元）', type: 'number' as const, default: 0, min: 0, step: 50 },
  { key: 'minus', label: '减（元）', type: 'number' as const, default: 0, min: 0, step: 10 },
]

const money = (n: number) => `${n.toFixed(2)} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const price = Number(values.price) || 0
  if (price <= 0) return [{ label: '结果', value: '请输入原价', emphasis: true }]

  let current = price
  const discount = Number(values.discount)
  if (discount > 0 && discount < 10) current = current * (discount / 10)

  const second = Number(values.second)
  if (second > 0 && second < 10) current = current * (second / 10)

  const threshold = Number(values.threshold) || 0
  const minus = Number(values.minus) || 0
  let reached = false
  if (threshold > 0 && minus > 0 && current >= threshold) {
    current = Math.max(0, current - minus)
    reached = true
  }

  const saved = price - current
  const rate = (current / price) * 10

  return [
    { label: '实付', value: money(current), emphasis: true, hint: `相当于 ${rate.toFixed(2)} 折` },
    { label: '省下', value: money(saved), hint: `节省 ${((saved / price) * 100).toFixed(1)}%` },
    { label: '折扣叠加后', value: money(price * ((discount || 10) / 10) * ((second || 10) / 10)) },
    {
      label: '满减',
      value: threshold > 0 ? (reached ? `已减 ${money(minus)}` : `未满 ${money(threshold)}`) : '未设置',
    },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '先算折扣再算满减，与多数电商结算顺序一致',
}

export default logic
