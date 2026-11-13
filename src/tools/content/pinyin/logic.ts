import { pinyin } from 'pinyin-pro'
import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'tone', label: '带声调', group: '转换' },
  { id: 'plain', label: '不带声调', group: '转换' },
  { id: 'first', label: '首字母', group: '转换' },
  { id: 'name', label: '姓名模式', group: '转换' },
]

function convert(text: string, op: string): string {
  switch (op) {
    case 'tone':
      return pinyin(text, { toneType: 'symbol', type: 'string', separator: ' ' })
    case 'plain':
      return pinyin(text, { toneType: 'none', type: 'string', separator: ' ' })
    case 'first':
      return pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' }).join('')
    case 'name':
      return pinyin(text, { surname: 'head', toneType: 'symbol', type: 'string', separator: ' ' })
    default:
      return text
  }
}

function apply(text: string, op: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() ? convert(line.trim(), op) : ''))
    .join('\n')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '折腾不止\n重庆银行\n单田芳',
  note: '内置词典支持多音字；人名与地名仍可能有歧义',
  inputLabel: '汉字',
  outputLabel: '拼音',
}

export default logic
