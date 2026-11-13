import type { TextOpLogic } from '@/components/templates/types'

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export function encodeBase58(bytes: Uint8Array): string {
  let zeros = 0
  while (zeros < bytes.length && bytes[zeros] === 0) zeros += 1

  let n = 0n
  for (const b of bytes) n = (n << 8n) | BigInt(b)

  let out = ''
  while (n > 0n) {
    out = ALPHABET[Number(n % 58n)]! + out
    n /= 58n
  }
  return '1'.repeat(zeros) + out
}

export function decodeBase58(text: string): Uint8Array {
  const s = text.trim().replace(/\s+/g, '')
  let zeros = 0
  while (zeros < s.length && s[zeros] === '1') zeros += 1

  let n = 0n
  for (const ch of s) {
    const digit = ALPHABET.indexOf(ch)
    if (digit < 0) throw new Error(`不是合法的 Base58 字符：${ch}`)
    n = n * 58n + BigInt(digit)
  }

  const bytes: number[] = []
  while (n > 0n) {
    bytes.unshift(Number(n & 0xffn))
    n >>= 8n
  }
  return new Uint8Array([...new Array<number>(zeros).fill(0), ...bytes])
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(' ')
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'encode', label: '文本 → Base58', group: '编码' },
    { id: 'decode', label: 'Base58 → 文本', group: '解码' },
  ],
  apply: (text, op) => {
    if (op === 'encode') return encodeBase58(new TextEncoder().encode(text))
    const bytes = decodeBase58(text)
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      return `（非 UTF-8 文本，以下为十六进制）\n${toHex(bytes)}`
    }
  },
  sample: 'hello base58',
  inputLabel: '输入',
  outputLabel: '输出',
  autoRun: true,
}

export default logic
