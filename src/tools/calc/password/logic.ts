const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/'
const AMBIGUOUS = '0O1lI|`\'"'

export interface PasswordOptions {
  length: number
  upper: boolean
  lower: boolean
  digits: boolean
  symbols: boolean
  excludeAmbiguous: boolean
  requireEach: boolean
}

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  upper: true,
  lower: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: true,
  requireEach: true,
}

/** 拒绝采样，消除取模偏差 */
export function randomInt(max: number): number {
  if (max <= 0) throw new Error('范围必须大于 0')
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  let value = 0
  do {
    crypto.getRandomValues(buf)
    value = buf[0] ?? 0
  } while (value >= limit)
  return value % max
}

export function pick(chars: string): string {
  return chars[randomInt(chars.length)] ?? ''
}

export function buildPools(options: PasswordOptions): string[] {
  const pools: string[] = []
  if (options.upper) pools.push(UPPER)
  if (options.lower) pools.push(LOWER)
  if (options.digits) pools.push(DIGITS)
  if (options.symbols) pools.push(SYMBOLS)
  return pools.map((p) =>
    options.excludeAmbiguous ? [...p].filter((c) => !AMBIGUOUS.includes(c)).join('') : p,
  )
}

export function generate(options: PasswordOptions): string {
  const pools = buildPools(options)
  if (!pools.length) throw new Error('至少选择一种字符类型')

  const length = Math.max(4, Math.min(128, options.length))
  const all = pools.join('')
  const chars: string[] = []

  if (options.requireEach) {
    for (const pool of pools) {
      if (chars.length >= length) break
      chars.push(pick(pool))
    }
  }

  while (chars.length < length) chars.push(pick(all))

  // Fisher–Yates 洗牌，消除「必含字符总在前几位」的规律
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    const tmp = chars[i]!
    chars[i] = chars[j]!
    chars[j] = tmp
  }

  return chars.join('')
}

export function entropyBits(password: string, poolSize: number): number {
  if (!poolSize) return 0
  return Math.round(password.length * Math.log2(poolSize))
}

export interface Strength {
  bits: number
  label: string
  level: 1 | 2 | 3 | 4
  hint: string
}

export function strengthOf(bits: number): Strength {
  if (bits >= 100) return { bits, label: '很强', level: 4, hint: '足以抵御离线暴力破解' }
  if (bits >= 75) return { bits, label: '强', level: 3, hint: '适合重要账号' }
  if (bits >= 50) return { bits, label: '中等', level: 2, hint: '建议加长或补充字符类型' }
  return { bits, label: '弱', level: 1, hint: '很容易被猜解，不要用于真实账号' }
}

export function poolSizeOf(options: PasswordOptions): number {
  return buildPools(options).reduce((n, p) => n + p.length, 0)
}

export const WORDS = [
  'amber','bamboo','cactus','dolphin','ember','falcon','galaxy','harbor','island','jungle',
  'kettle','lantern','meadow','nebula','orchid','pepper','quartz','rocket','shelter','timber',
  'umbrella','valley','walnut','yonder','zephyr','anchor','bridge','canyon','desert','flame',
]

export function passphrase(words = 4, separator = '-'): string {
  const picked: string[] = []
  for (let i = 0; i < words; i++) picked.push(WORDS[randomInt(WORDS.length)] ?? '')
  return picked.join(separator) + (DIGITS[randomInt(DIGITS.length)] ?? '')
}
