import type { TextOpLogic } from '@/components/templates/types'

const HEX = '0123456789ABCDEF'

export function encodeQp(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let out = ''
  let lineLen = 0

  for (const b of bytes) {
    if (b === 0x0a) {
      out += '\n'
      lineLen = 0
      continue
    }
    if (b === 0x0d) continue

    const token =
      b >= 33 && b <= 126 && b !== 0x3d
        ? String.fromCharCode(b)
        : b === 0x20 || b === 0x09
          ? String.fromCharCode(b)
          : `=${HEX[b >> 4]}${HEX[b & 0x0f]}`

    if (lineLen + token.length > 75) {
      out += '=\n'
      lineLen = 0
    }
    out += token
    lineLen += token.length
  }
  return out
}

export function decodeQp(text: string): string {
  const src = text.replace(/=\r?\n/g, '')
  const bytes: number[] = []

  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i]!
    if (ch === '=') {
      const hex = src.slice(i + 1, i + 3)
      if (!/^[0-9a-fA-F]{2}$/.test(hex)) throw new Error(`第 ${i + 1} 个字符处的 = 后面不是两位十六进制`)
      bytes.push(Number.parseInt(hex, 16))
      i += 2
      continue
    }
    const code = ch.charCodeAt(0)
    if (code > 255) bytes.push(...new TextEncoder().encode(ch))
    else bytes.push(code)
  }

  return new TextDecoder('utf-8').decode(new Uint8Array(bytes))
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'encode', label: '编码', group: '转换' },
    { id: 'decode', label: '解码', group: '转换' },
  ],
  apply: (text, op) => (op === 'encode' ? encodeQp(text) : decodeQp(text)),
  sample: '中文测试 =E4=B8=AD=E6=96=87',
  inputLabel: '输入',
  outputLabel: '输出',
  autoRun: true,
}

export default logic
