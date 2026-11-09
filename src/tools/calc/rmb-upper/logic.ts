import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'upper', label: '转大写', group: '转换' },
  { id: 'plain', label: '规整数字', group: '整理' },
]

const DIGITS = '零壹贰叁肆伍陆柒捌玖'
const UNITS = ['', '拾', '佰', '仟']
const SECTIONS = ['', '万', '亿', '万亿']

function sectionToChinese(n: number): string {
  let out = ''
  let pendingZero = false
  for (let i = 3; i >= 0; i--) {
    const digit = Math.floor(n / 10 ** i) % 10
    if (digit === 0) {
      if (out) pendingZero = true
      continue
    }
    if (pendingZero) {
      out += DIGITS[0]
      pendingZero = false
    }
    out += DIGITS[digit] + UNITS[i]
  }
  return out
}

export function toRmbUpper(input: number): string {
  if (!Number.isFinite(input)) throw new Error('不是有效金额')
  if (input === 0) return '零元整'
  if (input > 99999999999999.99) throw new Error('金额过大')

  const negative = input < 0
  const abs = Math.abs(input)
  const cents = Math.round(abs * 100)
  const yuan = Math.floor(cents / 100)
  const jiao = Math.floor((cents % 100) / 10)
  const fen = cents % 10

  let intText = ''
  if (yuan === 0) {
    intText = ''
  } else {
    let rest = yuan
    let idx = 0
    while (rest > 0) {
      const section = rest % 10000
      if (section !== 0) {
        const text = sectionToChinese(section)
        intText = (intText && section < 1000 ? '零' : '') + text + SECTIONS[idx] + intText
      }
      rest = Math.floor(rest / 10000)
      idx++
    }
    intText += '元'
  }

  let decimal = ''
  if (jiao === 0 && fen === 0) {
    decimal = '整'
  } else {
    if (jiao > 0) decimal += `${DIGITS[jiao]}角`
    else if (yuan > 0) decimal += '零'
    if (fen > 0) decimal += `${DIGITS[fen]}分`
    else decimal += '整'
  }

  return (negative ? '负' : '') + (intText || '零元') + decimal
}

function apply(text: string, op: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const clean = line.replace(/[,，\s¥￥元]/g, '').trim()
      if (!clean) return ''
      const n = Number(clean)
      if (Number.isNaN(n)) throw new Error(`「${line}」不是有效数字`)
      if (op === 'plain') return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return toRmbUpper(n)
    })
    .join('\n')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '12345.67\n100000\n0.5\n2000',
  note: '按银行财务规范输出，零角时补「零」再接分',
  inputLabel: '金额',
  outputLabel: '结果',
}

export default logic
