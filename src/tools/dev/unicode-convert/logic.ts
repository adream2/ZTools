import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'toUnicode', label: '转 \\u 转义', group: '转换' },
  { id: 'fromUnicode', label: '\\u 转中文', group: '转换' },
  { id: 'toCodePoint', label: '转 U+ 码位', group: '转换' },
  { id: 'fromCodePoint', label: 'U+ 转中文', group: '转换' },
]

function toUnicode(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.codePointAt(0)!
      if (code < 128) return ch
      if (code > 0xffff) {
        // 补充平面用代理对，与 JSON.stringify 行为一致
        const high = Math.floor((code - 0x10000) / 0x400) + 0xd800
        const low = ((code - 0x10000) % 0x400) + 0xdc00
        return `\\u${high.toString(16).padStart(4, '0')}\\u${low.toString(16).padStart(4, '0')}`
      }
      return `\\u${code.toString(16).padStart(4, '0')}`
    })
    .join('')
}

function fromUnicode(text: string): string {
  return text.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_m, braced: string, plain: string) => {
    const code = parseInt(braced ?? plain, 16)
    return Number.isFinite(code) ? String.fromCodePoint(code) : _m
  })
}

function toCodePoint(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.codePointAt(0)!
      return code < 128 ? ch : `U+${code.toString(16).toUpperCase().padStart(4, '0')}`
    })
    .join(' ')
}

function fromCodePoint(text: string): string {
  return text.replace(/(?:U\+|u\+|0x)?([0-9a-fA-F]{4,6})/g, (m, hex: string) => {
    const code = parseInt(hex, 16)
    if (!Number.isFinite(code) || code > 0x10ffff) return m
    return String.fromCodePoint(code)
  })
}

function apply(text: string, op: string): string {
  switch (op) {
    case 'toUnicode':
      return toUnicode(text)
    case 'fromUnicode':
      return fromUnicode(text)
    case 'toCodePoint':
      return toCodePoint(text)
    case 'fromCodePoint':
      return fromCodePoint(text)
    default:
      return text
  }
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '你好，世界 🛠️',
  note: '补充平面字符（如 emoji）按 UTF-16 代理对输出',
  inputLabel: '文本或转义序列',
  outputLabel: '结果',
}

export default logic
