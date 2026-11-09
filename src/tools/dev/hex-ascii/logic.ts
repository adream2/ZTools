import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'toHex', label: '文本 → Hex', group: '转换' },
  { id: 'fromHex', label: 'Hex → 文本', group: '转换' },
  { id: 'toBin', label: '文本 → 二进制', group: '转换' },
  { id: 'fromBin', label: '二进制 → 文本', group: '转换' },
  { id: 'hexToBin', label: 'Hex → 二进制', group: '转换' },
]

function toHex(text: string): string {
  const bytes = new TextEncoder().encode(text)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(' ')
}

function fromHex(text: string): string {
  const clean = text.replace(/0x/gi, '').replace(/[\s,;:_-]/g, '')
  if (clean.length % 2 !== 0) throw new Error('Hex 长度必须是偶数')
  if (!/^[0-9a-fA-F]*$/.test(clean)) throw new Error('包含非十六进制字符')
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return new TextDecoder('utf-8').decode(bytes)
  }
}

function toBin(text: string): string {
  const bytes = new TextEncoder().encode(text)
  return [...bytes].map((b) => b.toString(2).padStart(8, '0')).join(' ')
}

function fromBin(text: string): string {
  const clean = text.replace(/[^01]/g, '')
  if (!clean.length) throw new Error('没有找到二进制位')
  const padded = clean.padEnd(Math.ceil(clean.length / 8) * 8, '0')
  const bytes = new Uint8Array(padded.length / 8)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(padded.slice(i * 8, i * 8 + 8), 2)
  return new TextDecoder('utf-8').decode(bytes)
}

function hexToBin(text: string): string {
  const clean = text.replace(/0x/gi, '').replace(/[\s,;:_-]/g, '')
  if (!clean) throw new Error('没有找到十六进制字符')
  if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error('包含非十六进制字符')
  return (clean.match(/.{1,2}/g) ?? [])
    .map((b) => parseInt(b.padEnd(2, '0'), 16).toString(2).padStart(8, '0'))
    .join(' ')
}

function apply(text: string, op: string): string {
  switch (op) {
    case 'toHex':
      return toHex(text)
    case 'fromHex':
      return fromHex(text)
    case 'toBin':
      return toBin(text)
    case 'fromBin':
      return fromBin(text)
    case 'hexToBin':
      return hexToBin(text)
    default:
      return text
  }
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'Hello 折腾',
  note: '按 UTF-8 字节处理，中文一个字占 3 字节',
  inputLabel: '文本或字节序列',
  outputLabel: '结果',
}

export default logic
