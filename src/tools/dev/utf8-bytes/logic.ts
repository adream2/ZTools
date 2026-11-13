import type { TextOpLogic } from '@/components/templates/types'

export function toUtf8Hex(text: string): string {
  return [...new TextEncoder().encode(text)].map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
}

export function fromUtf8Hex(input: string): string {
  const clean = input
    .replace(/\\x/gi, ' ')
    .replace(/0x/gi, ' ')
    .replace(/[^0-9a-fA-F]/g, ' ')
    .trim()
  const tokens = clean.split(/\s+/).filter(Boolean)
  if (!tokens.length) throw new Error('没有识别出十六进制字节')
  if (tokens.some((t) => t.length !== 2)) throw new Error('每个字节应为两位十六进制，例如 E4 B8 AD')
  const bytes = new Uint8Array(tokens.map((t) => Number.parseInt(t, 16)))
  return new TextDecoder('utf-8').decode(bytes)
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'to-hex', label: '文本 → 字节', group: '转换' },
    { id: 'from-hex', label: '字节 → 文本', group: '转换' },
  ],
  apply: (text, op) => {
    if (op === 'to-hex') {
      const hex = toUtf8Hex(text)
      const bytes = new TextEncoder().encode(text).length
      return `${hex}\n\n共 ${[...text].length} 个字符 / ${bytes} 字节`
    }
    return fromUtf8Hex(text)
  },
  sample: '中文 ab 😀',
  inputLabel: '输入',
  outputLabel: '输出',
  autoRun: true,
}

export default logic
