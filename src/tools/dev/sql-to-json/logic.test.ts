import { describe, expect, it } from 'vitest'
import { sqlToJson } from './logic'

describe('SQL 转 JSON', () => {
  it('按字段名映射成对象', () => {
    const out = sqlToJson(`INSERT INTO users (id, name, age) VALUES (1, '张三', 28), (2, '李四', 34);`)
    expect(out).toEqual([
      { id: 1, name: '张三', age: 28 },
      { id: 2, name: '李四', age: 34 },
    ])
  })

  it('处理转义引号与 NULL', () => {
    const out = sqlToJson(`INSERT INTO t (a, b) VALUES ('O''Brien', NULL), (TRUE, 1.5)`)
    expect(out).toEqual([
      { a: "O'Brien", b: null },
      { a: true, b: 1.5 },
    ])
  })

  it('没有字段列表时返回数组', () => {
    const out = sqlToJson(`INSERT INTO t VALUES (1, 'x'), (2, 'y')`)
    expect(out).toEqual([
      [1, 'x'],
      [2, 'y'],
    ])
  })

  it('非 INSERT 语句报错', () => {
    expect(() => sqlToJson('SELECT 1')).toThrow(/INSERT/)
  })
})
