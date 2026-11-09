export type UuidVersion = 'v4' | 'v7'

function hex(byte: number): string {
  return byte.toString(16).padStart(2, '0')
}

export function uuidV4(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80
  return format(bytes)
}

/** RFC 9562 UUIDv7：48 位毫秒时间戳 + 随机位，可按时间排序 */
export function uuidV7(timestamp = Date.now()): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  bytes[0] = Math.floor(timestamp / 2 ** 40) & 0xff
  bytes[1] = Math.floor(timestamp / 2 ** 32) & 0xff
  bytes[2] = Math.floor(timestamp / 2 ** 24) & 0xff
  bytes[3] = Math.floor(timestamp / 2 ** 16) & 0xff
  bytes[4] = Math.floor(timestamp / 2 ** 8) & 0xff
  bytes[5] = timestamp & 0xff

  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x70
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80

  return format(bytes)
}

function format(bytes: Uint8Array): string {
  const h = Array.from(bytes, hex).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export interface UuidOptions {
  version: UuidVersion
  count: number
  uppercase: boolean
  hyphens: boolean
}

export function generate(options: UuidOptions): string[] {
  const out: string[] = []
  for (let i = 0; i < options.count; i++) {
    const base = options.version === 'v7' ? uuidV7() : uuidV4()
    let id = options.hyphens ? base : base.replace(/-/g, '')
    if (options.uppercase) id = id.toUpperCase()
    out.push(id)
  }
  return out
}

export function timestampOfV7(uuid: string): Date | null {
  const clean = uuid.replace(/-/g, '')
  if (clean.length !== 32) return null
  const ts = parseInt(clean.slice(0, 12), 16)
  if (!Number.isFinite(ts)) return null
  return new Date(ts)
}
