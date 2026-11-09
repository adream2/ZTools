const ITERATIONS = 150_000
const SALT_LEN = 16
const IV_LEN = 12

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64(text: string): Uint8Array {
  const binary = atob(text.trim())
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** 输出 base64(salt + iv + cipher)，自带全部解密参数 */
export async function encryptText(text: string, password: string): Promise<string> {
  if (!password) throw new Error('请输入密码')
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN))
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN))
  const key = await deriveKey(password, salt)
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    new TextEncoder().encode(text),
  )

  const out = new Uint8Array(SALT_LEN + IV_LEN + cipher.byteLength)
  out.set(salt, 0)
  out.set(iv, SALT_LEN)
  out.set(new Uint8Array(cipher), SALT_LEN + IV_LEN)
  return toBase64(out)
}

export async function decryptText(payload: string, password: string): Promise<string> {
  if (!password) throw new Error('请输入密码')
  let bytes: Uint8Array
  try {
    bytes = fromBase64(payload)
  } catch {
    throw new Error('密文不是合法的 Base64')
  }
  if (bytes.length <= SALT_LEN + IV_LEN) throw new Error('密文长度不足，可能被截断')

  const salt = bytes.slice(0, SALT_LEN)
  const iv = bytes.slice(SALT_LEN, SALT_LEN + IV_LEN)
  const cipher = bytes.slice(SALT_LEN + IV_LEN)
  const key = await deriveKey(password, salt)

  try {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as unknown as BufferSource }, key, cipher)
    return new TextDecoder().decode(plain)
  } catch {
    throw new Error('解密失败：密码错误或密文被篡改')
  }
}

export function entropyHint(password: string): string {
  if (password.length < 8) return '密码偏短，建议 12 位以上'
  return `PBKDF2 ${ITERATIONS.toLocaleString()} 次迭代`
}
