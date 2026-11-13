import { describe, expect, it } from 'vitest'
import logic, { minifyHtml } from './logic'

describe('HTML 压缩', () => {
  it('合并标签间空白并去注释', () => {
    expect(minifyHtml('<div>  <p> a </p> </div>')).toBe('<div><p> a </p></div>')
    expect(minifyHtml('<div><!-- 注释 --><p>x</p></div>')).toBe('<div><p>x</p></div>')
  })

  it('保留 pre 与 script 内部格式', () => {
    const html = '<div>\n  <pre>\n  缩进\n</pre>\n</div>'
    const out = minifyHtml(html)
    expect(out).toContain('<pre>\n  缩进\n</pre>')
  })

  it('保留条件注释', () => {
    const html = '<!--[if IE]><p>x</p><![endif]-->'
    expect(minifyHtml(html)).toContain('[if IE]')
  })

  it('只删注释模式不动空白', () => {
    const out = logic.apply('<div>  <!-- x -->  <p>y</p></div>', 'strip')
    expect(out).toBe('<div>    <p>y</p></div>')
  })
})
