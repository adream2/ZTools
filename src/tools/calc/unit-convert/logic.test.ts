import { describe, expect, it } from 'vitest'
import { CATEGORIES, convert, pretty } from './logic'

describe('单位换算', () => {
  it('长度换算', () => {
    expect(convert(1, 'm', 'cm', 'length')).toBeCloseTo(100)
    expect(convert(1, 'km', 'm', 'length')).toBeCloseTo(1000)
    expect(convert(1, 'in', 'cm', 'length')).toBeCloseTo(2.54)
    expect(convert(1, 'mi', 'km', 'length')).toBeCloseTo(1.609344)
    expect(convert(3, 'chi', 'm', 'length')).toBeCloseTo(1)
  })

  it('重量换算', () => {
    expect(convert(1, 'kg', 'jin', 'weight')).toBeCloseTo(2)
    expect(convert(1, 'lb', 'g', 'weight')).toBeCloseTo(453.59237)
  })

  it('温度换算', () => {
    expect(convert(100, 'c', 'f', 'temperature')).toBeCloseTo(212)
    expect(convert(32, 'f', 'c', 'temperature')).toBeCloseTo(0)
    expect(convert(0, 'c', 'k', 'temperature')).toBeCloseTo(273.15)
  })

  it('数据存储按 1024 进制', () => {
    expect(convert(1, 'gb', 'mb', 'data')).toBeCloseTo(1024)
    expect(convert(1, 'mb', 'kb', 'data')).toBeCloseTo(1024)
  })

  it('面积与体积', () => {
    expect(convert(1, 'mu', 'm2', 'area')).toBeCloseTo(666.6667, 3)
    expect(convert(1, 'm3', 'l', 'volume')).toBeCloseTo(1000)
  })

  it('未知单位抛错', () => {
    expect(() => convert(1, 'xx', 'm', 'length')).toThrow()
  })

  it('每类都至少两个单位', () => {
    for (const c of CATEGORIES) expect(c.units.length).toBeGreaterThan(1)
  })

  it('数值格式化去掉浮点尾巴', () => {
    expect(pretty(0.30000000000000004)).toBe('0.3')
    expect(pretty(1 / 3)).toBe('0.3333333333')
    expect(pretty(0)).toBe('0')
  })
})
