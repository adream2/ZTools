import { describe, expect, it } from 'vitest'
import type { CalcResult } from '@/components/templates/types'
import balance from './logic'
import molar from '../molar-mass/logic'

const runBalance = (equation: string): CalcResult[] => balance.compute({ equation }) as CalcResult[]
const runMolar = (formula: string): CalcResult[] => molar.compute({ formula }) as CalcResult[]

function coeffs(equation: string): string {
  const rows = runBalance(equation)
  return String(rows.find((r) => r.label === '系数')?.value ?? '')
}

describe('化学方程式配平', () => {
  it('H2 + O2 → H2O', () => {
    expect(coeffs('H2 + O2 -> H2O')).toBe('2 : 1 : 2')
  })

  it('Fe + O2 → Fe2O3', () => {
    expect(coeffs('Fe + O2 -> Fe2O3')).toBe('4 : 3 : 2')
  })

  it('丙烷燃烧', () => {
    expect(coeffs('C3H8 + O2 -> CO2 + H2O')).toBe('1 : 5 : 3 : 4')
  })

  it('甲烷燃烧（等号写法）', () => {
    expect(coeffs('CH4 + O2 = CO2 + H2O')).toBe('1 : 2 : 1 : 2')
  })

  it('括号与多物质', () => {
    expect(coeffs('Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O')).toBe('3 : 2 : 1 : 6')
  })

  it('写不出守恒时给出提示', () => {
    const rows = runBalance('H2 + O2 -> Na')
    expect(String(rows[0]?.value)).toMatch(/无解|无法/)
  })

  it('缺分隔符报错', () => {
    expect(String(runBalance('H2 + O2')[0]?.value)).toMatch(/->/)
  })
})

describe('摩尔质量', () => {
  it('H2O 约 18.02', () => {
    const rows = runMolar('H2O')
    expect(String(rows[0]?.value)).toBe('18.02 g/mol')
  })

  it('Ca(OH)2 约 74.09', () => {
    const rows = runMolar('Ca(OH)2')
    expect(String(rows[0]?.value)).toMatch(/^74\.0/)
  })

  it('未知元素报错', () => {
    const rows = runMolar('Xx2')
    expect(String(rows[0]?.value)).toMatch(/未知元素/)
  })

  it('括号不配对报错', () => {
    const rows = runMolar('Ca(OH2')
    expect(String(rows[0]?.value)).toMatch(/括号/)
  })
})
