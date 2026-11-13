import { describe, expect, it } from 'vitest'
import { parseToml } from './logic'

describe('TOML 解析', () => {
  it('解析表与基础类型', () => {
    const out = parseToml(`
[package]
name = "zttools"
version = 1.2
pwa = true

[features]
list = ["a", "b"]
`)
    expect(out.package).toEqual({ name: 'zttools', version: 1.2, pwa: true })
    expect(out.features).toEqual({ list: ['a', 'b'] })
  })

  it('去掉注释且不误伤字符串里的 #', () => {
    const out = parseToml('key = "a#b" # 这是注释')
    expect(out.key).toBe('a#b')
  })

  it('支持嵌套表名', () => {
    const out = parseToml('[a.b]\nc = 1')
    expect(out).toEqual({ a: { b: { c: 1 } } })
  })

  it('遇到不支持的语法报错并带行号', () => {
    expect(() => parseToml('[[arr]]\nx = 1')).toThrow(/数组表/)
    expect(() => parseToml('[a]\nbad line')).toThrow(/第 2 行/)
  })
})
