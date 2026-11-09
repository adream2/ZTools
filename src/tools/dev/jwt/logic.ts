export interface JwtDecoded {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: string
}

export interface JwtClaim {
  label: string
  key: string
  value: string
  meaning?: string
}

function b64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  try {
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  } catch {
    throw new Error('Base64URL 段解码失败，token 可能被截断')
  }
}

export function decodeSegment(segment: string): Record<string, unknown> {
  const text = new TextDecoder().decode(b64UrlToBytes(segment))
  try {
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object') throw new Error('不是对象')
    return parsed as Record<string, unknown>
  } catch {
    throw new Error(`段内容不是合法 JSON：${text.slice(0, 60)}`)
  }
}

export function decodeJwt(token: string): JwtDecoded {
  const clean = token.trim().replace(/^Bearer\s+/i, '')
  const parts = clean.split('.')
  if (parts.length < 2) throw new Error('JWT 至少需要 header.payload 两段')

  return {
    header: decodeSegment(parts[0] ?? ''),
    payload: decodeSegment(parts[1] ?? ''),
    signature: parts[2] ?? '',
    raw: clean,
  }
}

const CLAIM_MEANING: Record<string, string> = {
  iss: '签发者',
  sub: '主体',
  aud: '受众',
  exp: '过期时间',
  nbf: '生效时间',
  iat: '签发时间',
  jti: '唯一 ID',
  scope: '权限范围',
  roles: '角色',
  name: '名称',
  email: '邮箱',
  preferred_username: '用户名',
}

const TIME_CLAIMS = new Set(['exp', 'nbf', 'iat', 'auth_time', 'updated_at'])

export function describeClaims(payload: Record<string, unknown>): JwtClaim[] {
  return Object.entries(payload).map(([key, value]) => {
    let display = typeof value === 'string' ? value : JSON.stringify(value)
    if (TIME_CLAIMS.has(key) && typeof value === 'number') {
      const d = new Date(value * 1000)
      display = `${value} → ${d.toLocaleString('zh-CN')}`
    }
    return { key, label: CLAIM_MEANING[key] ?? key, value: display, meaning: CLAIM_MEANING[key] }
  })
}

export type TokenStatus = 'valid' | 'expired' | 'not-yet' | 'unknown'

export function statusOf(payload: Record<string, unknown>, now = Date.now()): { status: TokenStatus; text: string } {
  const exp = typeof payload.exp === 'number' ? payload.exp * 1000 : null
  const nbf = typeof payload.nbf === 'number' ? payload.nbf * 1000 : null

  if (nbf && now < nbf) return { status: 'not-yet', text: `尚未生效，${new Date(nbf).toLocaleString('zh-CN')} 起可用` }
  if (exp === null) return { status: 'unknown', text: '未声明 exp，无法判断是否过期' }
  if (now >= exp) return { status: 'expired', text: `已过期 ${Math.round((now - exp) / 1000)} 秒` }
  return { status: 'valid', text: `剩余 ${formatDuration(exp - now)}` }
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (d) return `${d} 天 ${h} 小时`
  if (h) return `${h} 小时 ${m} 分`
  if (m) return `${m} 分 ${s} 秒`
  return `${s} 秒`
}
