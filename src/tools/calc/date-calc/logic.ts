const MS_DAY = 86400000

/** 只取年月日，规避时区与夏令时影响 */
export function toUtcDay(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
}

export function parseDate(input: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim())
  if (!m) throw new Error('日期格式应为 YYYY-MM-DD')
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  const date = new Date(y, mo - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) {
    throw new Error('日期不存在，请检查月份与天数')
  }
  return date
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function today(): string {
  return formatDate(new Date())
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((toUtcDay(b) - toUtcDay(a)) / MS_DAY)
}

export interface DiffBreakdown {
  days: number
  weeks: number
  months: number
  years: number
  yearsMonthsDays: string
  workdays: number
  weekend: number
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay()
  return day === 0 || day === 6
}

export function countWorkdays(a: Date, b: Date): number {
  const start = toUtcDay(a)
  const end = toUtcDay(b)
  const lo = Math.min(start, end)
  const hi = Math.max(start, end)
  let count = 0
  for (let t = lo; t < hi; t += MS_DAY) {
    const d = new Date(t)
    if (!isWeekend(d)) count++
  }
  return count
}

export function breakdown(a: Date, b: Date): DiffBreakdown {
  const days = Math.abs(daysBetween(a, b))
  const [early, late] = toUtcDay(a) <= toUtcDay(b) ? [a, b] : [b, a]

  // 年月日拆分
  let years = late.getFullYear() - early.getFullYear()
  let months = late.getMonth() - early.getMonth()
  let dayPart = late.getDate() - early.getDate()

  if (dayPart < 0) {
    months--
    const prevMonth = new Date(late.getFullYear(), late.getMonth(), 0)
    dayPart += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const workdays = countWorkdays(a, b)

  return {
    days,
    weeks: Math.floor(days / 7),
    months: Math.floor(days / 30.4375),
    years: Math.floor(days / 365.25),
    yearsMonthsDays: `${years} 年 ${months} 个月 ${dayPart} 天`,
    workdays,
    weekend: days - workdays,
  }
}

export interface Delta {
  years: number
  months: number
  days: number
}

export function addDelta(date: Date, delta: Delta): Date {
  const next = new Date(date.getTime())
  next.setDate(1)
  next.setFullYear(next.getFullYear() + delta.years)
  next.setMonth(next.getMonth() + delta.months)
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(date.getDate(), lastDay))
  next.setDate(next.getDate() + delta.days)
  return next
}

export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  nextBirthdayDays: number
  zodiac: string
}

const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

export function ageOf(birth: Date, now = new Date()): AgeResult {
  const b = breakdown(birth, now)
  const totalDays = Math.abs(daysBetween(birth, now))

  let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (toUtcDay(next) < toUtcDay(now)) next = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate())

  return {
    years: b.years,
    months: b.months,
    days: b.days,
    totalDays,
    nextBirthdayDays: daysBetween(now, next),
    zodiac: ZODIAC[(((birth.getFullYear() - 2020) % 12) + 12) % 12] ?? '—',
  }
}

export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function weekdayOf(d: Date): string {
  return WEEKDAYS[d.getDay()] ?? ''
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1)
  return daysBetween(start, d) + 1
}

export function totalDaysInYear(y: number): number {
  return isLeapYear(y) ? 366 : 365
}
