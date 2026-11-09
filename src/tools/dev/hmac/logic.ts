export type HmacAlgo = 'SHA-1' | 'SHA-256' | 'SHA-512'
export type OutputEncoding = 'hex' | 'base64'

export const ALGOS: { id: HmacAlgo; label: string }[] = [
  { id: 'SHA-1', label: 'HmacSHA1' },
  { id: 'SHA-256', label: 'HmacSHA256' },
  { id: 'SHA-512', label: 'HmacSHA512' },
]

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('')
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

export async function sign(message: string, secret: string, algo: HmacAlgo, encoding: OutputEncoding): Promise<string> {
  if (!secret) throw new Error('密钥不能为空')

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: algo },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return encoding === 'base64' ? toBase64(signature) : toHex(signature)
}

/** 常见接口约定：把参数按 key 排序后拼成 a=1&b=2，再对整串签名 */
export function canonicalQuery(params: Record<string, string>): string {
  return Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
}
