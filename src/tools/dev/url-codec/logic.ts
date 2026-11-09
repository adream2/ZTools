export interface QueryPair {
  key: string
  value: string
}

export function encodeComponent(text: string): string {
  return encodeURIComponent(text)
}

export function decodeComponent(text: string): string {
  try {
    return decodeURIComponent(text.replace(/\+/g, ' '))
  } catch {
    throw new Error('存在非法的百分号转义（如单独的 %）')
  }
}

export function encodeFullUrl(text: string): string {
  try {
    return encodeURI(text)
  } catch {
    return encodeURIComponent(text)
  }
}

export function decodeFullUrl(text: string): string {
  try {
    return decodeURI(text)
  } catch {
    throw new Error('存在非法的百分号转义')
  }
}

export function parseQuery(input: string): QueryPair[] {
  const raw = input.includes('?') ? input.slice(input.indexOf('?') + 1) : input
  const clean = raw.split('#')[0] ?? ''
  if (!clean.trim()) return []

  const params = new URLSearchParams(clean)
  const pairs: QueryPair[] = []
  for (const [key, value] of params) pairs.push({ key, value })
  return pairs
}

export function buildQuery(pairs: QueryPair[]): string {
  const params = new URLSearchParams()
  for (const { key, value } of pairs) {
    if (key.trim()) params.append(key, value)
  }
  return params.toString()
}

export function encodeQueryPairs(pairs: QueryPair[]): QueryPair[] {
  return pairs.map(({ key, value }) => ({ key: encodeURIComponent(key), value: encodeURIComponent(value) }))
}

const UNRESERVED = /^[A-Za-z0-9\-._~!$&'()*+,;=:@/?#[\]]*$/

export function hasEncodedChars(text: string): boolean {
  return /%[0-9a-fA-F]{2}/.test(text) && !UNRESERVED.test(text)
}
