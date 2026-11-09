import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'thousands', label: '千分位', group: '格式化' },
  { id: 'chinese', label: '中文读法', group: '格式化' },
  { id: 'scientific', label: '科学计数', group: '格式化' },
  { id: 'percent', label: '转百分比', group: '格式化' },
  { id: 'plain', label: '去千分位', group: '还原' },
]

const DIGITS = '零一二三四五六七八九'
const UNITS = ['', '十', '百', '千']
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

export function toChinese(input: number): string {
  if (!Number.isFinite(input)) throw new Error('不是有效数字')
  if (input === 0) return '零'

  const negative = input < 0
  let n = Math.abs(input)
  const intPart = Math.floor(n)
  const decimals = String(n).split('.')[1] ?? ''

  if (intPart > 99999999999999) throw new Error('数字太大，超出支持范围')

  let result = ''
  let sectionIndex = 0
  let rest = intPart

  while (rest > 0) {
    const section = rest % 10000
    if (section !== 0) {
      const text = sectionToChinese(section)
      const needZero = result && section < 1000
      result = (needZero ? '零' : '') + text + SECTIONS[sectionIndex] + result
    }
    rest = Math.floor(rest / 10000)
    sectionIndex++
  }

  // 「一十二」→「十二」
  if (result.startsWith('一十')) result = result.slice(1)

  if (decimals) {
    result += '点' + [...decimals].map((d) => DIGITS[Number(d)]).join('')
  }

  return (negative ? '负' : '') + result
}

function parseLines(text: string, fn: (n: number) => string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const clean = line.trim().replace(/,/g, '')
      if (!clean) return ''
      const n = Number(clean)
      if (Number.isNaN(n)) throw new Error(`「${line}」不是数字`)
      return fn(n)
    })
    .join('\n')
}

function apply(text: string, op: string): string {
  switch (op) {
    case 'thousands':
      return parseLines(text, (n) => n.toLocaleString('en-US', { maximumFractionDigits: 10 }))
    case 'chinese':
      return parseLines(text, toChinese)
    case 'scientific':
      return parseLines(text, (n) => n.toExponential())
    case 'percent':
      return parseLines(text, (n) => `${Number((n * 100).toPrecision(10))}%`)
    case 'plain':
      return text.replace(/,/g, '')
    default:
      return text
  }
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '1234567.89\n10086\n-2500',
  note: '一行一个数字，支持负号与小数',
  inputLabel: '数字',
  outputLabel: '结果',
}

export default logic
