import { describe, expect, it } from 'vitest'
import { byteLength, cleanInput, convertAll, groupBinary, parseInBase, toBase } from './logic'

describe('radix', () => {
  it('十进制转各进制', () => {
    expect(toBase(255n, 2)).toBe('11111111')
    expect(toBase(255n, 8)).toBe('377')
    expect(toBase(255n, 16)).toBe('ff')
    expect(toBase(35n, 36)).toBe('z')
  })

  it('各进制转十进制', () => {
    expect(parseInBase('11111111', 2)).toBe(255n)
    expect(parseInBase('ff', 16)).toBe(255n)
    expect(parseInBase('zz', 36)).toBe(1295n)
  })

  it('支持超大数，不丢精度', () => {
    const big = 'ffffffffffffffffffffffff'
    expect(toBase(parseInBase(big, 16), 16)).toBe(big)
  })

  it('自动忽略前缀与分隔符', () => {
    expect(cleanInput('0xFF_FF', 16)).toBe('ffff')
    expect(cleanInput('1111 0000', 2)).toBe('11110000')
  })

  it('四字符分组', () => {
    expect(groupBinary('11111111')).toBe('1111 1111')
    expect(groupBinary('1111')).toBe('1111')
  })

  it('非法字符抛错', () => {
    expect(() => parseInBase('', 10)).toThrow()
  })

  it('同时输出全部进制', () => {
    const all = convertAll('10', 10)
    expect(all.find((r) => r.base === 2)?.value).toBe('1010')
    expect(all.find((r) => r.base === 16)?.value).toBe('a')
  })

  it('字节数', () => {
    expect(byteLength(255n)).toBe(1)
    expect(byteLength(256n)).toBe(2)
    expect(byteLength(0n)).toBe(1)
  })
})
