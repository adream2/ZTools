import { describe, expect, it } from 'vitest'
import { addDelta, ageOf, breakdown, daysBetween, isLeapYear, parseDate, weekdayOf } from './logic'

describe('日期计算', () => {
  it('解析日期并拒绝非法值', () => {
    expect(parseDate('2024-02-29').getDate()).toBe(29)
    expect(() => parseDate('2024-02-30')).toThrow()
    expect(() => parseDate('2024/01/01')).toThrow()
  })

  it('天数差跨月跨年', () => {
    expect(daysBetween(parseDate('2024-01-01'), parseDate('2024-01-31'))).toBe(30)
    expect(daysBetween(parseDate('2023-12-31'), parseDate('2024-01-01'))).toBe(1)
    expect(daysBetween(parseDate('2024-03-01'), parseDate('2024-02-01'))).toBe(-29)
  })

  it('闰年 2 月', () => {
    expect(daysBetween(parseDate('2024-02-01'), parseDate('2024-03-01'))).toBe(29)
    expect(daysBetween(parseDate('2023-02-01'), parseDate('2023-03-01'))).toBe(28)
  })

  it('年月日拆分', () => {
    const b = breakdown(parseDate('2020-01-15'), parseDate('2024-03-20'))
    expect(b.yearsMonthsDays).toBe('4 年 2 个月 5 天')
  })

  it('日期加减', () => {
    expect(addDelta(parseDate('2024-01-31'), { years: 0, months: 1, days: 0 }).getDate()).toBe(29)
    expect(addDelta(parseDate('2024-01-01'), { years: 0, months: 0, days: 100 }).getMonth()).toBe(3)
    expect(addDelta(parseDate('2024-03-01'), { years: 0, months: 0, days: -1 }).getDate()).toBe(29)
  })

  it('工作日统计', () => {
    const b = breakdown(parseDate('2024-01-01'), parseDate('2024-01-08'))
    expect(b.days).toBe(7)
    expect(b.workdays).toBe(5)
    expect(b.weekend).toBe(2)
  })

  it('年龄', () => {
    const a = ageOf(parseDate('2000-01-01'), parseDate('2024-06-15'))
    expect(a.years).toBe(24)
    expect(a.zodiac).toBeTruthy()
  })

  it('闰年判定与星期', () => {
    expect(isLeapYear(2024)).toBe(true)
    expect(isLeapYear(1900)).toBe(false)
    expect(isLeapYear(2000)).toBe(true)
    expect(weekdayOf(parseDate('2024-01-01'))).toBe('周一')
  })
})
