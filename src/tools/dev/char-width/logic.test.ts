import { describe, expect, it } from 'vitest'
import { displayWidth } from './logic'

describe('字符显示宽度', () => {
  it('中文与全角占 2 格', () => {
    expect(displayWidth('中文')).toBe(4)
    expect(displayWidth('，')).toBe(2)
  })

  it('英文与半角占 1 格', () => {
    expect(displayWidth('abc')).toBe(3)
    expect(displayWidth('a b')).toBe(3)
  })

  it('emoji 占 2 格', () => {
    expect(displayWidth('😀')).toBe(2)
    expect(displayWidth('a😀b')).toBe(4)
  })

  it('零宽字符不占宽度', () => {
    expect(displayWidth('a\u200bb')).toBe(2)
  })
})
