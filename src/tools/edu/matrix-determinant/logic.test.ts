import { describe, expect, it } from 'vitest'
import type { CalcResult } from '@/components/templates/types'
import logic, { determinant, parseMatrix } from './logic'

const run = (v: Record<string, string>): CalcResult[] => logic.compute(v) as CalcResult[]

describe('矩阵行列式', () => {
  it('2 阶', () => {
    expect(determinant([[1, 2], [3, 4]])).toBe(-2)
  })

  it('3 阶整数矩阵', () => {
    expect(determinant([[2, 1, 0], [1, 3, 1], [0, 1, 2]])).toBe(8)
  })

  it('奇异矩阵为 0', () => {
    expect(determinant([[1, 2], [2, 4]])).toBe(0)
    const rows = run({ matrix: '1 2\n2 4' })
    expect(String(rows[3]?.value)).toBe('不可逆')
  })

  it('非方阵报错', () => {
    expect(() => parseMatrix('1 2 3\n4 5 6')).toThrow(/方阵/)
  })

  it('行列数不一致报错', () => {
    expect(() => parseMatrix('1 2\n3 4 5')).toThrow(/个数不一致/)
  })

  it('逗号分隔也支持', () => {
    expect(determinant(parseMatrix('1,2\n3,4'))).toBe(-2)
  })
})
