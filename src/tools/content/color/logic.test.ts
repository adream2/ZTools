import { describe, expect, it } from 'vitest'
import { contrastRatio, hexToRgb, judge, normalizeHex, readableText, rgbToHex, rgbToHsl, rgbToHsv, shades } from './logic'

describe('颜色换算', () => {
  it('HEX 归一化', () => {
    expect(normalizeHex('#FFF')).toBe('#ffffff')
    expect(normalizeHex('2F6BFF')).toBe('#2f6bff')
    expect(() => normalizeHex('#12')).toThrow()
  })

  it('HEX ↔ RGB', () => {
    expect(hexToRgb('#2f6bff')).toEqual({ r: 47, g: 107, b: 255 })
    expect(rgbToHex({ r: 47, g: 107, b: 255 })).toBe('#2f6bff')
  })

  it('RGB → HSL / HSV', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 })
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 })
  })

  it('对比度符合 WCAG 参考值', () => {
    const white = { r: 255, g: 255, b: 255 }
    const black = { r: 0, g: 0, b: 0 }
    expect(contrastRatio(white, black)).toBeCloseTo(21, 0)
    expect(contrastRatio(white, white)).toBeCloseTo(1)
  })

  it('等级判定', () => {
    const w = { r: 255, g: 255, b: 255 }
    const b = { r: 0, g: 0, b: 0 }
    expect(judge(w, b).grade).toBe('AAA')
    expect(judge(w, b).aaNormal).toBe(true)
    expect(judge({ r: 230, g: 230, b: 230 }, w).aaNormal).toBe(false)
  })

  it('自动选可读文字色', () => {
    expect(readableText('#ffffff')).toBe('#17181c')
    expect(readableText('#000000')).toBe('#ffffff')
  })

  it('梯度数量与首尾', () => {
    const s = shades('#2f6bff', 11)
    expect(s).toHaveLength(11)
    // 保留色相做明度梯度：最亮接近白色带蓝调，最暗接近黑色，且互不重复
    expect(s[0]).toBe('#e5edff')
    expect(new Set(s).size).toBe(11)
    expect(s.every((h) => /^#[0-9a-f]{6}$/.test(h))).toBe(true)
  })
})
