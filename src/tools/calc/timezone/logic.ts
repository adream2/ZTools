import type { CalcLogic, CalcResult } from '@/components/templates/types'

const ZONES = [
  { label: '本地', value: 'local' },
  { label: 'UTC', value: 'UTC' },
  { label: '北京', value: 'Asia/Shanghai' },
  { label: '东京', value: 'Asia/Tokyo' },
  { label: '新加坡', value: 'Asia/Singapore' },
  { label: '迪拜', value: 'Asia/Dubai' },
  { label: '伦敦', value: 'Europe/London' },
  { label: '巴黎', value: 'Europe/Paris' },
  { label: '纽约', value: 'America/New_York' },
  { label: '洛杉矶', value: 'America/Los_Angeles' },
  { label: '悉尼', value: 'Australia/Sydney' },
]

const FIELDS = [
  { key: 'datetime', label: '时间', type: 'text' as const, default: '', hint: '留空表示现在，格式 2026-05-01 09:30' },
  { key: 'from', label: '源时区', type: 'select' as const, default: 'Asia/Shanghai', options: ZONES },
]

function parseLocal(text: string): Date {
  const clean = text.trim()
  if (!clean) return new Date()
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(clean)
  if (!m) throw new Error('时间格式应为 2026-05-01 09:30')
  return new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4] ?? 0),
    Number(m[5] ?? 0),
    Number(m[6] ?? 0),
  )
}

/** 把「某时区的墙上时间」转成真实时间点 */
function zonedToDate(wall: Date, zone: string): Date {
  if (zone === 'local') return wall
  const utcGuess = Date.UTC(wall.getFullYear(), wall.getMonth(), wall.getDate(), wall.getHours(), wall.getMinutes(), wall.getSeconds())
  const formatted = new Date(utcGuess).toLocaleString('en-US', { timeZone: zone })
  const offset = new Date(formatted).getTime() - utcGuess
  return new Date(utcGuess - offset)
}

function format(date: Date, zone: string): string {
  if (zone === 'local') {
    return date.toLocaleString('zh-CN', { hour12: false })
  }
  return date.toLocaleString('zh-CN', { timeZone: zone, hour12: false })
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const from = String(values.from ?? 'Asia/Shanghai')
  let wall: Date
  try {
    wall = parseLocal(String(values.datetime ?? ''))
  } catch (e) {
    return [{ label: '时间无效', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  const instant = zonedToDate(wall, from)
  const rows: CalcResult[] = [
    { label: '时间点', value: instant.toISOString(), emphasis: true, hint: 'UTC 标准表示' },
  ]

  for (const zone of ZONES) {
    if (zone.value === from) continue
    rows.push({ label: zone.label, value: format(instant, zone.value) })
  }
  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '使用浏览器内置时区数据库，自动处理夏令时',
}

export default logic
