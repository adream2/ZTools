import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'rot13', label: 'ROT13', group: '字母' },
  { id: 'rot5', label: 'ROT5（数字）', group: '数字' },
  { id: 'rot18', label: 'ROT18（字母 + 数字）', group: '组合' },
  { id: 'caesar3', label: '凯撒 +3', group: '字母' },
  { id: 'caesarNeg3', label: '凯撒 -3', group: '字母' },
]

function rotAlpha(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= 'a' ? 97 : 65
    const code = ch.charCodeAt(0) - base
    return String.fromCharCode(base + ((code + shift + 26) % 26))
  })
}

function rotDigit(text: string): string {
  return text.replace(/\d/g, (d) => String((Number(d) + 5) % 10))
}

function apply(text: string, op: string): string {
  switch (op) {
    case 'rot13':
      return rotAlpha(text, 13)
    case 'rot5':
      return rotDigit(text)
    case 'rot18':
      return rotDigit(rotAlpha(text, 13))
    case 'caesar3':
      return rotAlpha(text, 3)
    case 'caesarNeg3':
      return rotAlpha(text, -3)
    default:
      return text
  }
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'Hello, World! 2026',
  note: 'ROT13 与 ROT5 都是自反的：再执行一次即还原',
  inputLabel: '文本',
  outputLabel: '结果',
}

export default logic
