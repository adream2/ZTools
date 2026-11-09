export interface JsonStats {
  bytes: number
  chars: number
  lines: number
  nodes: number
  depth: number
  arrays: number
  objects: number
}

export interface FormatOptions {
  indent: number | '\t'
  sortKeys: boolean
}

export const MAX_INPUT = 20 * 1024 * 1024
export const WORKER_THRESHOLD = 256 * 1024

export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch (err) {
    throw new Error(normalizeJsonError(err, text))
  }
}

/** 把原生 "Unexpected token } in JSON at position 42" 变成带行列的可读信息 */
export function normalizeJsonError(err: unknown, text: string): string {
  const raw = err instanceof Error ? err.message : String(err)
  const m = /position (\d+)/.exec(raw)
  if (!m) return raw
  const pos = Number(m[1])
  const before = text.slice(0, pos)
  const line = before.split('\n').length
  const col = pos - before.lastIndexOf('\n')
  const snippet = text.slice(Math.max(0, pos - 30), pos + 30).replace(/\n/g, '⏎')
  return `${raw}\n位置：第 ${line} 行第 ${col} 列\n上下文：…${snippet}…`
}

export function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(src).sort((a, b) => a.localeCompare(b))) {
      out[key] = sortDeep(src[key])
    }
    return out
  }
  return value
}

export function formatJson(text: string, options: FormatOptions): string {
  const parsed = parseJson(text)
  const target = options.sortKeys ? sortDeep(parsed) : parsed
  const space = options.indent === '\t' ? '\t' : options.indent
  return JSON.stringify(target, null, space)
}

export function minifyJson(text: string): string {
  return JSON.stringify(parseJson(text))
}

export function escapeJson(text: string): string {
  return JSON.stringify(text).slice(1, -1)
}

export function unescapeJson(text: string): string {
  try {
    return JSON.parse(`"${text.replace(/"/g, '\\"')}"`) as string
  } catch {
    throw new Error('不是合法的转义序列')
  }
}

export function jsonStats(text: string): JsonStats {
  let nodes = 0
  let depth = 0
  let arrays = 0
  let objects = 0

  const parsed = JSON.parse(text) as unknown
  const walk = (value: unknown, level: number): void => {
    nodes++
    depth = Math.max(depth, level)
    if (Array.isArray(value)) {
      arrays++
      for (const item of value) walk(item, level + 1)
    } else if (value && typeof value === 'object') {
      objects++
      for (const item of Object.values(value as Record<string, unknown>)) walk(item, level + 1)
    }
  }
  walk(parsed, 1)

  return {
    bytes: new TextEncoder().encode(text).length,
    chars: text.length,
    lines: text.split('\n').length,
    nodes,
    depth,
    arrays,
    objects,
  }
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}
