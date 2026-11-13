import { describe, expect, it } from 'vitest'
import { searchAll } from './search'
import { similarTools } from './related'

describe('全站搜索', () => {
  it('空查询不返回结果', () => {
    expect(searchAll('   ')).toEqual([])
  })

  it('同时召回工具、专题与指南', () => {
    const hits = searchAll('图片', 30)
    expect(hits.some((h) => h.kind === 'tool')).toBe(true)
    expect(hits.some((h) => h.kind === 'topic')).toBe(true)
  })

  it('指南能通过标题关键词命中', () => {
    const hits = searchAll('配平', 20)
    expect(hits.some((h) => h.kind === 'guide' && h.id === 'chemical-balance-method')).toBe(true)
  })

  it('结果带可跳转地址与标签', () => {
    for (const hit of searchAll('json', 20)) {
      expect(hit.to.startsWith('/')).toBe(true)
      expect(hit.label.length).toBeGreaterThan(0)
    }
  })
})

describe('相似工具推荐', () => {
  it('排除自身且不超过上限', () => {
    const list = similarTools('ip-lookup', 6)
    expect(list.length).toBeGreaterThan(0)
    expect(list.length).toBeLessThanOrEqual(6)
    expect(list.every((t) => t.meta.id !== 'ip-lookup')).toBe(true)
  })

  it('优先推荐同子类工具', () => {
    const list = similarTools('json-formatter', 6)
    expect(list.some((t) => t.meta.subcategory === '格式化')).toBe(true)
  })
})
