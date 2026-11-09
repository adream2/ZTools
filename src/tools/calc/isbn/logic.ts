import type { CalcLogic, CalcResult } from '@/components/templates/types'

function isbn10Valid(s: string): boolean {
  if (!/^\d{9}[\dX]$/.test(s)) return false
  const sum = [...s].reduce((acc, ch, i) => acc + (ch === 'X' ? 10 : Number(ch)) * (10 - i), 0)
  return sum % 11 === 0
}

function isbn13Valid(s: string): boolean {
  if (!/^\d{13}$/.test(s)) return false
  const sum = [...s].reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0)
  return sum % 10 === 0
}

export function to13(s10: string): string {
  const core = `978${s10.slice(0, 9)}`
  const sum = [...core].reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0)
  return core + String((10 - (sum % 10)) % 10)
}

export function to10(s13: string): string {
  const core = s13.slice(3, 12)
  const sum = [...core].reduce((acc, ch, i) => acc + Number(ch) * (10 - i), 0)
  const check = 11 - (sum % 11)
  return core + (check === 10 ? 'X' : check === 11 ? '0' : String(check))
}

const FIELDS = [{ key: 'isbn', label: 'ISBN', type: 'text' as const, default: '9787115473899', hint: '10 位或 13 位，可带短横线' }]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.isbn ?? '').replace(/[-\s]/g, '').toUpperCase()
  if (!raw) return [{ label: '结果', value: '请输入 ISBN', emphasis: true }]

  if (raw.length === 10) {
    const valid = isbn10Valid(raw)
    const as13 = valid ? to13(raw) : ''
    return [
      { label: 'ISBN-10 校验', value: valid ? '通过' : '未通过', emphasis: true },
      { label: '转 ISBN-13', value: as13 || '—', hint: as13 ? `校验位 ${as13.slice(-1)}` : '先修正 10 位号码' },
      { label: '前缀', value: raw.slice(0, 9), hint: '9 位本体码' },
    ]
  }

  if (raw.length === 13) {
    const valid = isbn13Valid(raw)
    const as10 = valid && raw.startsWith('978') ? to10(raw) : ''
    return [
      { label: 'ISBN-13 校验', value: valid ? '通过' : '未通过', emphasis: true },
      { label: '转 ISBN-10', value: as10 || '—', hint: as10 ? `校验位 ${as10.slice(-1)}` : '仅 978 前缀可转 10 位' },
      { label: '前缀', value: raw.slice(0, 3), hint: '978 / 979' },
      { label: '出版组', value: raw.slice(3, 5) },
    ]
  }

  return [{ label: '格式错误', value: 'ISBN 应为 10 位或 13 位', emphasis: true }]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '仅校验格式，不查询书名信息',
}

export default logic
