const CHUNK = 0x8000

export function bytesToBase64(bytes: Uint8Array, urlSafe = false): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  const b64 = btoa(binary)
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64
}

export function base64ToBytes(input: string): Uint8Array {
  const normalized = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  let binary: string
  try {
    binary = atob(padded)
  } catch {
    throw new Error('不是合法的 Base64 字符串')
  }
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function encodeText(text: string, urlSafe = false): string {
  return bytesToBase64(new TextEncoder().encode(text), urlSafe)
}

export function decodeText(input: string): string {
  const bytes = base64ToBytes(input)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('解码结果不是合法 UTF-8，可能是二进制数据；请用「还原为文件」下载查看')
  }
}

export function isProbablyBase64(input: string): boolean {
  const s = input.replace(/\s+/g, '')
  return s.length >= 4 && s.length % 4 === 0 && /^[A-Za-z0-9+/_-]+={0,2}$/.test(s)
}

export async function fileToBase64(file: File, withPrefix = false): Promise<string> {
  const buf = await file.arrayBuffer()
  const b64 = bytesToBase64(new Uint8Array(buf))
  return withPrefix ? `data:${file.type || 'application/octet-stream'};base64,${b64}` : b64
}

export function base64ToBlob(input: string, mime = 'application/octet-stream'): Blob {
  return new Blob([base64ToBytes(input) as unknown as BlobPart], { type: mime })
}

export function sniffMime(input: string): string {
  const clean = input.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '')
  const head = atob(clean.slice(0, 24).padEnd(Math.ceil(clean.slice(0, 24).length / 4) * 4, '='))
  const b = Array.from(head, (c) => c.charCodeAt(0))
  if (b[0] === 0x89 && b[1] === 0x50) return 'image/png'
  if (b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg'
  if (b[0] === 0x47 && b[1] === 0x49) return 'image/gif'
  if (b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57) return 'image/webp'
  if (b[0] === 0x25 && b[1] === 0x50) return 'application/pdf'
  if (b[0] === 0x50 && b[1] === 0x4b) return 'application/zip'
  return 'application/octet-stream'
}
