import { describe, expect, it } from 'vitest'
import { base64ToBytes, bytesToBase64, decodeText, encodeText, isProbablyBase64, sniffMime } from './logic'

describe('base64', () => {
  it('编解码 ASCII', () => {
    expect(encodeText('hello')).toBe('aGVsbG8=')
    expect(decodeText('aGVsbG8=')).toBe('hello')
  })

  it('编解码中文与 emoji', () => {
    const text = '折腾不止 🛠️'
    expect(decodeText(encodeText(text))).toBe(text)
  })

  it('URL-safe 变体不含 + / =', () => {
    const out = encodeText('??>>~~\u00ff\u00fe', true)
    expect(out).not.toMatch(/[+/=]/)
    expect(decodeText(out)).toBe('??>>~~\u00ff\u00fe')
  })

  it('容忍空白与 URL-safe 字符', () => {
    expect(decodeText('aGVs bG8=')).toBe('hello')
  })

  it('非法输入抛错', () => {
    expect(() => decodeText('%%%%')).toThrow()
  })

  it('base64 判定', () => {
    expect(isProbablyBase64('aGVsbG8=')).toBe(true)
    expect(isProbablyBase64('hello world')).toBe(false)
  })

  it('字节往返', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255])
    expect(Array.from(base64ToBytes(bytesToBase64(bytes)))).toEqual([0, 1, 2, 250, 255])
  })

  it('嗅探 MIME', () => {
    const png = bytesToBase64(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))
    expect(sniffMime(png)).toBe('image/png')
  })
})
