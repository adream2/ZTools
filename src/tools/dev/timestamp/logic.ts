export type TimestampUnit = 's' | 'ms'

export function detectUnit(raw: string): TimestampUnit {
  const digits = raw.replace(/\D/g, '')
  return digits.length > 10 ? 'ms' : 's'
}

export function toDate(value: string, unit?: TimestampUnit): Date {
  const trimmed = value.trim()
  if (!trimmed) throw new Error('请输入时间戳或日期')

  if (/^-?\d+$/.test(trimmed)) {
    const n = Number(trimmed)
    const u = unit ?? detectUnit(trimmed)
    const ms = u === 's' ? n * 1000 : n
    const d = new Date(ms)
    if (Number.isNaN(d.getTime())) throw new Error('时间戳超出可表示范围')
    return d
  }

  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) throw new Error('无法识别的日期格式，试试 2024-05-01 12:00:00')
  return d
}

export function toTimestamp(date: Date, unit: TimestampUnit): number {
  return unit === 's' ? Math.floor(date.getTime() / 1000) : date.getTime()
}

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function formatIso(date: Date): string {
  return date.toISOString()
}

export function formatInZone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return '—'
  }
}

export function relative(date: Date, now = Date.now()): string {
  const diff = date.getTime() - now
  const abs = Math.abs(diff)
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [1000 * 60 * 60 * 24 * 365, 'year'],
    [1000 * 60 * 60 * 24 * 30, 'month'],
    [1000 * 60 * 60 * 24, 'day'],
    [1000 * 60 * 60, 'hour'],
    [1000 * 60, 'minute'],
    [1000, 'second'],
  ]
  const rtf = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' })
  for (const [ms, unit] of units) {
    if (abs >= ms) return rtf.format(Math.round(diff / ms), unit)
  }
  return '刚刚'
}

export const ZONES: { label: string; tz: string }[] = [
  { label: '本地时间', tz: '' },
  { label: 'UTC', tz: 'UTC' },
  { label: '北京', tz: 'Asia/Shanghai' },
  { label: '东京', tz: 'Asia/Tokyo' },
  { label: '纽约', tz: 'America/New_York' },
  { label: '洛杉矶', tz: 'America/Los_Angeles' },
  { label: '伦敦', tz: 'Europe/London' },
  { label: '柏林', tz: 'Europe/Berlin' },
]

export function currentInfo(): { ms: number; s: number; iso: string; local: string } {
  const now = new Date()
  return { ms: now.getTime(), s: Math.floor(now.getTime() / 1000), iso: now.toISOString(), local: formatLocal(now) }
}
