import type { CalcLogic, CalcResult } from '@/components/templates/types'

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const CHECK = '10X98765432'

export function parseIdCard(id: string) {
  const clean = id.trim().toUpperCase()
  if (!/^\d{17}[\dX]$/.test(clean)) throw new Error('身份证号应为 18 位，最后一位可为 X')

  const area = clean.slice(0, 6)
  const birthday = clean.slice(6, 14)
  const seq = clean.slice(14, 17)
  const check = clean.slice(17)

  const year = Number(birthday.slice(0, 4))
  const month = Number(birthday.slice(4, 6))
  const day = Number(birthday.slice(6, 8))
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('生日段不是有效日期')
  }
  if (year < 1900 || date > new Date()) throw new Error('生日超出合理范围')

  const sum = [...clean.slice(0, 17)].reduce((acc, ch, i) => acc + Number(ch) * (WEIGHTS[i] ?? 0), 0)
  const expected = CHECK[sum % 11]

  return {
    area,
    birthday: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    date,
    gender: Number(seq) % 2 === 1 ? '男' : '女',
    check,
    expected,
    valid: check === expected,
    age: Math.floor((Date.now() - date.getTime()) / (365.25 * 86400000)),
  }
}

const FIELDS = [{ key: 'id', label: '身份证号', type: 'text' as const, default: '110105199003071234' }]

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.id ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入身份证号', emphasis: true }]

  let p: ReturnType<typeof parseIdCard>
  try {
    p = parseIdCard(raw)
  } catch (e) {
    return [{ label: '解析失败', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  return [
    {
      label: '校验位',
      value: p.valid ? '正确' : `错误（应为 ${p.expected}）`,
      emphasis: true,
      hint: p.valid ? '号码结构合法' : '可能是录入错误或伪造',
    },
    { label: '出生日期', value: p.birthday, hint: `${p.age} 岁` },
    { label: '性别', value: p.gender, hint: '第 17 位奇男偶女' },
    { label: '地区码', value: p.area, hint: '前 6 位行政区划' },
    { label: '顺序码', value: raw.slice(14, 17) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '仅做格式与校验位验证，不代表号码真实存在',
}

export default logic
