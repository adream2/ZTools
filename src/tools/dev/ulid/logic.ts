import type { GeneratorLogic } from '@/components/templates/types'

const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function encodeTime(time: number, length: number): string {
  let out = ''
  let t = time
  for (let i = length - 1; i >= 0; i--) {
    out = ENCODING[t % 32] + out
    t = Math.floor(t / 32)
  }
  return out
}

export function ulid(now = Date.now()): string {
  const random = new Uint8Array(16)
  crypto.getRandomValues(random)
  let out = encodeTime(now, 10)
  for (let i = 0; i < 16; i++) out += ENCODING[(random[i] ?? 0) % 32]
  return out
}

export function parseUlid(id: string): { time: Date; random: string } {
  const clean = id.trim().toUpperCase()
  if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(clean)) throw new Error('不是合法 ULID（26 位 Crockford Base32）')
  let time = 0
  for (const ch of clean.slice(0, 10)) time = time * 32 + ENCODING.indexOf(ch)
  return { time: new Date(time), random: clean.slice(10) }
}

const FIELDS = [
  { key: 'count', label: '数量', type: 'number' as const, default: 10, min: 1, max: 200 },
  { key: 'lower', label: '小写', type: 'switch' as const, default: false },
  { key: 'sorted', label: '按时间升序', type: 'switch' as const, default: true },
]

function generate(values: Record<string, string | number | boolean>): string[] {
  const count = Math.min(200, Math.max(1, Number(values.count) || 1))
  const base = Date.now()
  const list = Array.from({ length: count }, (_, i) => ulid(values.sorted ? base + i : Date.now()))
  return values.lower ? list.map((id) => id.toLowerCase()) : list
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '前 10 位是毫秒时间戳，后 16 位随机；同毫秒内不保证严格有序',
  resultLabel: 'ULID',
}

export default logic
