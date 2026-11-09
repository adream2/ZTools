import type { CalcLogic, CalcResult } from '@/components/templates/types'

export function luhnCheck(card: string): boolean {
  const digits = card.replace(/\D/g, '')
  if (digits.length < 12) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (double) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    double = !double
  }
  return sum % 10 === 0
}

export function orgOf(card: string): { name: string; type: string } {
  const n = card.replace(/\D/g, '')
  if (/^4/.test(n)) return { name: 'Visa', type: '信用卡 / 借记卡' }
  if (/^(5[1-5]|2[2-7])/.test(n)) return { name: 'Mastercard', type: '信用卡' }
  if (/^3[47]/.test(n)) return { name: 'American Express', type: '信用卡' }
  if (/^35/.test(n)) return { name: 'JCB', type: '信用卡' }
  if (/^62/.test(n)) return { name: '银联', type: '借记卡 / 信用卡' }
  if (/^9[45]/.test(n)) return { name: 'Discover', type: '信用卡' }
  if (/^3[068]/.test(n)) return { name: 'Diners Club', type: '信用卡' }
  return { name: '未知', type: '—' }
}

const FIELDS = [{ key: 'card', label: '卡号', type: 'text' as const, default: '6222020200112233445' }]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.card ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入卡号', emphasis: true }]

  const digits = raw.replace(/\D/g, '')
  const valid = luhnCheck(digits)
  const org = orgOf(digits)
  const grouped = digits.replace(/(.{4})(?=.)/g, '$1 ')

  return [
    { label: 'Luhn 校验', value: valid ? '通过' : '未通过', emphasis: true, hint: valid ? '格式合法' : '可能输错或被伪造成' },
    { label: '卡组织', value: org.name, hint: org.type },
    { label: '卡号长度', value: `${digits.length} 位` },
    { label: '分组显示', value: grouped },
    { label: '后四位', value: digits.slice(-4) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'Luhn 只验证格式，不能判断卡是否真实可用',
}

export default logic
