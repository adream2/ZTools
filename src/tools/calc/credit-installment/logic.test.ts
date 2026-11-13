import { describe, expect, it } from 'vitest'
import type { CalcResult } from '@/components/templates/types'
import logic from './logic'

const run = (v: Record<string, string | number>): CalcResult[] => logic.compute(v) as CalcResult[]

describe('分期真实利率', () => {
  it('月费率 0.6% 分 12 期，实际年化远高于 7.2%', () => {
    const rows = run({ amount: 12000, months: 12, fee: 0.6, mode: 'monthly' })
    const annual = Number.parseFloat(String(rows[0]?.value))
    expect(annual).toBeGreaterThan(12)
    expect(annual).toBeLessThan(15)
  })

  it('零费率时年化为 0', () => {
    const rows = run({ amount: 12000, months: 12, fee: 0, mode: 'monthly' })
    expect(Number.parseFloat(String(rows[0]?.value))).toBeCloseTo(0, 2)
  })

  it('一次性收取比每期收取更贵', () => {
    const monthly = Number.parseFloat(String(run({ amount: 12000, months: 12, fee: 0.6, mode: 'monthly' })[0]?.value))
    const once = Number.parseFloat(String(run({ amount: 12000, months: 12, fee: 0.6, mode: 'once' })[0]?.value))
    expect(once).toBeGreaterThan(monthly)
  })
})
