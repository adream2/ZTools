export interface MatchInfo {
  index: number
  text: string
  groups: (string | undefined)[]
  named: Record<string, string> | undefined
}

export interface RegexResult {
  matches: MatchInfo[]
  truncated: boolean
  duration: number
}

export interface RegexPayload {
  pattern: string
  flags: string
  text: string
  limit: number
  replace?: string
}

/** 内部强制 g 以便循环，但不动用户选择的其它 flag */
export function buildRegex(pattern: string, flags: string): RegExp {
  const clean = flags.replace(/[^gimsuy]/g, '')
  const withGlobal = clean.includes('g') ? clean : `${clean}g`
  try {
    return new RegExp(pattern, withGlobal)
  } catch (e) {
    throw new Error(`正则语法错误：${e instanceof Error ? e.message : String(e)}`)
  }
}

export function testRegex(payload: RegexPayload): RegexResult {
  const started = performance.now()
  const re = buildRegex(payload.pattern, payload.flags)
  const matches: MatchInfo[] = []
  let truncated = false
  let guard = 0

  let m: RegExpExecArray | null
  while ((m = re.exec(payload.text)) !== null) {
    matches.push({
      index: m.index,
      text: m[0],
      groups: m.slice(1),
      named: m.groups ? { ...m.groups } : undefined,
    })
    // 零宽匹配时手动前进，避免死循环
    if (m[0] === '') re.lastIndex += 1
    if (++guard > payload.limit) {
      truncated = true
      break
    }
    if (re.lastIndex > payload.text.length) break
  }

  return { matches, truncated, duration: Math.round((performance.now() - started) * 100) / 100 }
}

export function replaceAll(payload: RegexPayload, replacement: string): string {
  const re = buildRegex(payload.pattern, payload.flags)
  return payload.text.replace(re, replacement)
}

export interface Segment {
  text: string
  match: boolean
}

export function toSegments(text: string, matches: MatchInfo[]): Segment[] {
  const out: Segment[] = []
  let cursor = 0
  for (const m of matches) {
    if (m.index > cursor) out.push({ text: text.slice(cursor, m.index), match: false })
    if (m.text) out.push({ text: m.text, match: true })
    cursor = m.index + m.text.length
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), match: false })
  return out
}

export const FLAGS: { id: string; label: string; hint: string }[] = [
  { id: 'g', label: 'g', hint: '全局匹配' },
  { id: 'i', label: 'i', hint: '忽略大小写' },
  { id: 'm', label: 'm', hint: '多行模式' },
  { id: 's', label: 's', hint: '. 匹配换行' },
  { id: 'u', label: 'u', hint: 'Unicode' },
]
