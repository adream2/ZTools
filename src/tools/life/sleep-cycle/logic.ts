import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'bed', label: '上床时间', type: 'text' as const, default: '23:30', hint: '24 小时制，如 23:30' },
  { key: 'latency', label: '入睡耗时（分钟）', type: 'number' as const, default: 15, min: 0, max: 90 },
  {
    key: 'cycle',
    label: '周期长度',
    type: 'select' as const,
    default: 90,
    options: [
      { label: '90 分钟（常见）', value: 90 },
      { label: '80 分钟', value: 80 },
      { label: '70 分钟', value: 70 },
    ],
  },
]

function parseTime(raw: string): number | null {
  const m = /^(\d{1,2})[:：](\d{1,2})$/.exec(String(raw).trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

function fmt(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const bed = parseTime(String(values.bed))
  if (bed === null) return [{ label: '结果', value: '上床时间格式应为 23:30 这样', emphasis: true }]

  const latency = Math.min(90, Math.max(0, Math.round(Number(values.latency)) || 0))
  const cycle = Math.round(Number(values.cycle)) || 90
  const start = bed + latency

  const rows: CalcResult[] = [3, 4, 5, 6].map((n) => {
    const wake = start + n * cycle
    const total = n * cycle + latency
    return {
      label: `${n} 个周期`,
      value: fmt(wake),
      hint: `睡 ${Math.floor(total / 60)} 小时 ${total % 60} 分`,
      emphasis: n === 5,
    }
  })

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按一个周期 90 分钟粗算，实际以自己醒后的状态为准',
}

export default logic
