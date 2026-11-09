export const BASES = [
  { value: 2, label: '二进制' },
  { value: 8, label: '八进制' },
  { value: 10, label: '十进制' },
  { value: 16, label: '十六进制' },
  { value: 36, label: '36 进制' },
] as const

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

export function cleanInput(text: string, base: number): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/^0[bxo]/, '')
    .replace(/[\s_,]/g, '')
    .replace(/^\+/, '')
    .slice(0, 4096)
    .split('')
    .filter((ch) => DIGITS.indexOf(ch) >= 0 && DIGITS.indexOf(ch) < base)
    .join('')
}

export function parseInBase(text: string, base: number): bigint {
  const clean = cleanInput(text, base)
  if (!clean) throw new Error('请输入有效数字')

  let result = 0n
  const b = BigInt(base)
  for (const ch of clean) {
    const digit = DIGITS.indexOf(ch)
    if (digit < 0 || digit >= base) throw new Error(`字符「${ch}」不是 ${base} 进制的有效数字`)
    result = result * b + BigInt(digit)
  }
  return result
}

export function toBase(value: bigint, base: number): string {
  if (value === 0n) return '0'
  const negative = value < 0n
  let n = negative ? -value : value
  const b = BigInt(base)
  let out = ''
  while (n > 0n) {
    out = DIGITS[Number(n % b)] + out
    n /= b
  }
  return negative ? `-${out}` : out
}

export function groupBinary(binary: string): string {
  const neg = binary.startsWith('-')
  const body = neg ? binary.slice(1) : binary
  const padded = body.padStart(Math.ceil(body.length / 4) * 4, '0')
  return (neg ? '-' : '') + padded.replace(/(.{4})(?=.)/g, '$1 ')
}

export function groupHex(hex: string): string {
  const neg = hex.startsWith('-')
  const body = neg ? hex.slice(1) : hex
  return (neg ? '-' : '') + body.replace(/(.{4})(?=.)/g, '$1 ')
}

export interface RadixResult {
  base: number
  label: string
  value: string
  grouped: string
}

export function convertAll(text: string, fromBase: number): RadixResult[] {
  const value = parseInBase(text, fromBase)
  return BASES.map((b) => {
    const raw = toBase(value, b.value)
    return {
      base: b.value,
      label: b.label,
      value: raw,
      grouped: b.value === 2 ? groupBinary(raw) : b.value === 16 ? groupHex(raw) : raw,
    }
  })
}

export function asciiHint(value: bigint): string {
  if (value <= 0n || value > 0x10ffffn) return ''
  try {
    return String.fromCodePoint(Number(value))
  } catch {
    return ''
  }
}

export function byteLength(value: bigint): number {
  if (value === 0n) return 1
  let n = value < 0n ? -value : value
  let bytes = 0
  while (n > 0n) {
    n >>= 8n
    bytes++
  }
  return bytes
}
