import type { TextOpLogic } from '@/components/templates/types'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const OPS = [
  { id: 'encode', label: '编码', group: '转换' },
  { id: 'decode', label: '解码', group: '转换' },
]

export function encodeBase32(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bits = 0
  let value = 0
  let out = ''

  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31]
  while (out.length % 8 !== 0) out += '='
  return out
}

export function decodeBase32(input: string): string {
  const clean = input.toUpperCase().replace(/[\s-]/g, '').replace(/=+$/, '')
  if (!/^[A-Z2-7]*$/.test(clean)) throw new Error('包含非 Base32 字符（只允许 A-Z 与 2-7）')

  let bits = 0
  let value = 0
  const bytes: number[] = []

  for (const ch of clean) {
    const index = ALPHABET.indexOf(ch)
    if (index < 0) throw new Error(`字符「${ch}」不合法`)
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }

  return new TextDecoder('utf-8').decode(new Uint8Array(bytes))
}

function apply(text: string, op: string): string {
  return op === 'decode' ? decodeBase32(text) : encodeBase32(text)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'JBSWY3DPEBLW64TMMQ',
  note: '自动忽略空格、连字符与结尾的 =，可直接粘贴 TOTP 密钥',
  inputLabel: '文本或 Base32',
  outputLabel: '结果',
  noChain: true,
}

export default logic
