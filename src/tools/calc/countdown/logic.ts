import type { CalcLogic, CalcResult } from '@/components/templates/types'

function parseDate(text: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim())
  if (!m) throw new Error('日期格式应为 YYYY-MM-DD')
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (d.getMonth() !== Number(m[2]) - 1 || d.getDate() !== Number(m[3])) throw new Error('日期不存在')
  return d
}

const utcDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
const MS_DAY = 86400000

const FIELDS = [
  { key: 'target', label: '目标日期', type: 'date' as const, default: new Date(Date.now() + 30 * MS_DAY).toISOString().slice(0, 10) },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.target ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请选择日期', emphasis: true }]

  let target: Date
  try {
    target = parseDate(raw)
  } catch (e) {
    return [{ label: '日期无效', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  const today = new Date()
  const days = Math.round((utcDay(target) - utcDay(today)) / MS_DAY)
  const abs = Math.abs(days)

  return [
    {
      label: days >= 0 ? '还有' : '已过去',
      value: `${abs} 天`,
      emphasis: true,
      hint: days >= 0 ? '距离目标日期' : '目标日期已过',
    },
    { label: '周数', value: `${Math.floor(abs / 7)} 周 ${abs % 7} 天` },
    { label: '工作日约', value: `${Math.floor((abs / 7) * 5)} 天`, hint: '按每周 5 天粗估' },
    { label: '目标日期', value: `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}` },
    { label: '星期', value: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][target.getDay()] ?? '' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按本地时区计算自然日差值',
}

export default logic
