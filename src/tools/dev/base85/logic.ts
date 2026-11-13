import type { TextOpLogic } from '@/components/templates/types'

export function encodeAscii85(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i += 4) {
    let n = 0
    const chunk = [0, 0, 0, 0]
    for (let j = 0; j < 4; j += 1) {
      const b = bytes[i + j]
      if (b === undefined) break
      chunk[j] = b
      n += 1
    }
    const num = ((chunk[0]! << 24) | (chunk[1]! << 16) | (chunk[2]! << 8) | chunk[3]!) >>> 0
    if (num === 0 && n === 4) {
      out += 'z'
      continue
    }
    const digits: number[] = new Array(5).fill(0)
    let rest = num
    for (let k = 4; k >= 0; k -= 1) {
      digits[k] = rest % 85
      rest = Math.floor(rest / 85)
    }
    out += digits
      .slice(0, n + 1)
      .map((d) => String.fromCharCode(33 + d))
      .join('')
  }
  return out
}

export function decodeAscii85(text: string): Uint8Array {
  const src = text.replace(/\s+/g, '').replace(/^<~/, '').replace(/~>$/, '')
  const out: number[] = []
  let group: number[] = []

  const flush = (digits: number[], count: number): void => {
    let num = 0
    for (const d of digits) num = num * 85 + d
    const bytes = [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff]
    out.push(...bytes.slice(0, count))
  }

  for (const ch of src) {
    if (ch === 'z' && group.length === 0) {
      out.push(0, 0, 0, 0)
      continue
    }
    const code = ch.charCodeAt(0)
    if (code < 33 || code > 117) throw new Error(`非法 Ascii85 字符：${ch}`)
    group.push(code - 33)
    if (group.length === 5) {
      flush(group, 4)
      group = []
    }
  }

  if (group.length === 1) throw new Error('结尾字符数不合法')
  if (group.length > 1) {
    const count = group.length - 1
    while (group.length < 5) group.push(84)
    flush(group, count)
  }

  return new Uint8Array(out)
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'encode', label: '文本 → Base85', group: '编码' },
    { id: 'decode', label: 'Base85 → 文本', group: '解码' },
  ],
  apply: (text, op) => {
    if (op === 'encode') return encodeAscii85(new TextEncoder().encode(text))
    const bytes = decodeAscii85(text)
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      return `（非 UTF-8 文本，以下为十六进制）\n${[...bytes].map((b) => b.toString(16).padStart(2, '0')).join(' ')}`
    }
  },
  sample: 'hello ascii85',
  inputLabel: '输入',
  outputLabel: '输出',
  autoRun: true,
}

export default logic
