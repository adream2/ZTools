import { describe, expect, it } from 'vitest'
import type { CalcResult } from '@/components/templates/types'
import logic from './logic'

const run = (v: Record<string, number>): CalcResult[] => logic.compute(v) as CalcResult[]

describe('一元三次方程', () => {
  it('三个实根', () => {
    const rows = run({ a: 1, b: -6, c: 11, d: -6 })
    const values = rows.filter((r) => r.label.startsWith('x')).map((r) => Number(r.value))
    expect(values.sort((a, b) => a - b)).toEqual([1, 2, 3])
  })

  it('一个实根两个复根', () => {
    const rows = run({ a: 1, b: 0, c: 0, d: -1 })
    expect(rows[0]?.hint).toMatch(/一个实根/)
    expect(String(rows[1]?.value)).toBe('1')
  })

  it('重根', () => {
    const rows = run({ a: 1, b: 0, c: -3, d: 2 })
    expect(rows[0]?.hint).toMatch(/重根/)
  })

  it('a = 0 时提示改用二次', () => {
    const rows = run({ a: 0, b: 1, c: 1, d: 1 })
    expect(String(rows[0]?.value)).toMatch(/二次/)
  })
})
