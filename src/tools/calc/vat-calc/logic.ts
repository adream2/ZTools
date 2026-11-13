import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'amount', label: '金额（元）', type: 'number' as const, default: 1130, min: 0, step: 10 },
  {
    key: 'rate',
    label: '税率',
    type: 'select' as const,
    default: 13,
    options: [
      { label: '13%（货物）', value: 13 },
      { label: '9%（交通 / 不动产）', value: 9 },
      { label: '6%（现代服务）', value: 6 },
      { label: '3%（小规模）', value: 3 },
      { label: '1%（优惠）', value: 1 },
    ],
  },
  {
    key: 'mode',
    label: '输入的是',
    type: 'select' as const,
    default: 'inclusive',
    options: [
      { label: '含税价', value: 'inclusive' },
      { label: '不含税价', value: 'exclusive' },
    ],
  },
]

const money = (n: number): string => `${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元`

function compute(values: Record<string, string | number>): CalcResult[] {
  const amount = Number(values.amount)
  const rate = Number(values.rate) / 100
  if (!Number.isFinite(amount) || amount < 0) return [{ label: '结果', value: '请输入金额', emphasis: true }]

  const inclusive = String(values.mode) === 'inclusive'
  const net = inclusive ? amount / (1 + rate) : amount
  const tax = net * rate
  const total = net + tax

  return [
    { label: inclusive ? '不含税金额' : '含税金额', value: money(inclusive ? net : total), emphasis: true, hint: `税率 ${(rate * 100).toFixed(0)}%` },
    { label: '税额', value: money(tax) },
    { label: '不含税金额', value: money(net) },
    { label: '含税金额', value: money(total) },
    { label: '价税合计', value: money(total), hint: '开票金额以此为准' },
    { label: '税额占比', value: `${((tax / total) * 100).toFixed(2)}%`, hint: '税额 / 含税金额' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '仅做价税换算，不含进项抵扣与附加税',
}

export default logic
