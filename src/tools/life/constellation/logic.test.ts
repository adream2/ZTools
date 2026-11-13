import { describe, expect, it } from 'vitest'
import type { CalcResult } from '@/components/templates/types'
import logic, { signIndex } from './logic'

const run = (date: string): CalcResult[] => logic.compute({ date }) as CalcResult[]

describe('星座查询', () => {
  it('边界日归属正确', () => {
    expect(signIndex(12, 21)).toBe(11) // 射手最后一天
    expect(signIndex(12, 22)).toBe(0) // 摩羯第一天
    expect(signIndex(1, 19)).toBe(0) // 摩羯最后一天
    expect(signIndex(1, 20)).toBe(1) // 水瓶第一天
    expect(signIndex(8, 22)).toBe(7) // 狮子最后一天
    expect(signIndex(8, 23)).toBe(8) // 处女第一天
    expect(signIndex(11, 23)).toBe(11) // 射手第一天
  })

  it('返回星座与四象', () => {
    const rows = run('1995-08-20')
    expect(rows[0]?.value).toBe('狮子座')
    expect(rows[2]?.value).toBe('火象')
  })

  it('非法日期给出提示', () => {
    const rows = run('1995-13-40')
    expect(rows[0]?.emphasis).toBe(true)
  })
})
