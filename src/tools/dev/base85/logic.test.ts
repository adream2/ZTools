import { describe, expect, it } from 'vitest'
import { decodeAscii85, encodeAscii85 } from './logic'

describe('Base85', () => {
  it('往返一致（含非 4 字节整数倍）', () => {
    for (const text of ['a', 'ab', 'abc', 'abcd', 'hello ascii85', '中文测试']) {
      const bytes = new TextEncoder().encode(text)
      const encoded = encodeAscii85(bytes)
      const decoded = new TextDecoder().decode(decodeAscii85(encoded))
      expect(decoded).toBe(text)
    }
  })

  it('四个零字节压缩成 z', () => {
    expect(encodeAscii85(new Uint8Array([0, 0, 0, 0]))).toBe('z')
    expect([...decodeAscii85('z')]).toEqual([0, 0, 0, 0])
  })

  it('忽略空白与首尾定界符', () => {
    const encoded = ` <~ ${encodeAscii85(new TextEncoder().encode('hi'))} ~> `
    expect(new TextDecoder().decode(decodeAscii85(encoded))).toBe('hi')
  })
})
