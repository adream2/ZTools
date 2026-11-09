import { describe, expect, it } from 'vitest'
import { applyOp } from './logic'
import { count } from '@/tools/content/word-count/logic'

describe('文本处理', () => {
  it('大小写', () => {
    expect(applyOp('Hello World', 'upper')).toBe('HELLO WORLD')
    expect(applyOp('Hello World', 'lower')).toBe('hello world')
    expect(applyOp('hello world. foo bar', 'title')).toBe('Hello World. Foo Bar')
  })

  it('去重保留首次出现顺序', () => {
    expect(applyOp('b\na\nb\nc', 'dedupe')).toBe('b\na\nc')
  })

  it('排序', () => {
    expect(applyOp('c\na\nb', 'sort')).toBe('a\nb\nc')
    expect(applyOp('c\na\nb', 'sortDesc')).toBe('c\nb\na')
  })

  it('删除空行与首尾空格', () => {
    expect(applyOp('a\n\n\nb', 'removeEmpty')).toBe('a\nb')
    expect(applyOp('  a  \n\tb\t', 'trim')).toBe('a\nb')
  })

  it('添加行号对齐宽度', () => {
    expect(applyOp('a\nb', 'numberLines')).toBe('1. a\n2. b')
    const out = applyOp(Array.from({ length: 10 }, () => 'x').join('\n'), 'numberLines')
    expect(out.split('\n')[0]).toBe(' 1. x')
  })

  it('去 HTML 标签', () => {
    expect(applyOp('<p>hi <b>there</b></p><script>bad()</script>', 'stripHtml')).toBe('hi there')
  })

  it('全角转半角', () => {
    expect(applyOp('ＡＢＣ１２３！', 'fullToHalf')).toBe('ABC123!')
  })

  it('合并与拆分行', () => {
    expect(applyOp('a\nb\nc', 'joinLines')).toBe('a b c')
    expect(applyOp('a。b！c', 'splitToLines')).toBe('a\nb\nc')
  })
})

describe('字数统计', () => {
  it('区分中英文计数', () => {
    const r = count('你好世界 hello world')
    expect(r.cjk).toBe(4)
    expect(r.words).toBe(2)
    expect(r.chars).toBe(16)
  })

  it('空文本', () => {
    const r = count('')
    expect(r.chars).toBe(0)
    expect(r.lines).toBe(0)
    expect(r.readMinutes).toBe(0)
  })

  it('阅读时长至少 1 分钟', () => {
    expect(count('你好').readMinutes).toBe(1)
  })
})
