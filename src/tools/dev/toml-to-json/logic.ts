import type { TextOpLogic } from '@/components/templates/types'

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

/** 去掉行尾注释，引号里的 # 不算 */
function stripComment(raw: string): string {
  let quote = ''
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i]!
    if (quote) {
      if (ch === quote && raw[i - 1] !== '\\') quote = ''
    } else if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === '#') {
      return raw.slice(0, i)
    }
  }
  return raw
}

/** 按顶层逗号切分数组内容 */
function splitTop(text: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote = ''
  let buf = ''
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]!
    if (quote) {
      buf += ch
      if (ch === quote && text[i - 1] !== '\\') quote = ''
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      buf += ch
      continue
    }
    if (ch === '[' || ch === '{') depth += 1
    if (ch === ']' || ch === '}') depth -= 1
    if (ch === ',' && depth === 0) {
      parts.push(buf)
      buf = ''
      continue
    }
    buf += ch
  }
  if (buf.trim()) parts.push(buf)
  return parts
}

function parseValue(raw: string): Json {
  const text = raw.trim()
  if (!text) throw new Error('值为空')
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      return JSON.parse(text) as Json
    } catch {
      return text.slice(1, -1)
    }
  }
  if (text.startsWith("'") && text.endsWith("'")) return text.slice(1, -1)
  if (text === 'true') return true
  if (text === 'false') return false
  if (text.startsWith('[') && text.endsWith(']')) {
    const inner = text.slice(1, -1).trim()
    return inner ? splitTop(inner).map((part) => parseValue(part)) : []
  }
  if (/^[+-]?\d[\d_]*(\.\d[\d_]*)?([eE][+-]?\d+)?$/.test(text)) return Number(text.replace(/_/g, ''))
  // 日期、时间等裸值原样保留为字符串
  return text
}

function ensureTable(root: Record<string, Json>, path: string[]): Record<string, Json> {
  let cur = root
  for (const key of path) {
    const next = cur[key]
    if (next && typeof next === 'object' && !Array.isArray(next)) {
      cur = next as Record<string, Json>
    } else {
      const created: Record<string, Json> = {}
      cur[key] = created
      cur = created
    }
  }
  return cur
}

export function parseToml(src: string): Record<string, Json> {
  const root: Record<string, Json> = {}
  let current = root

  src.split(/\r?\n/).forEach((line, index) => {
    const text = stripComment(line).trim()
    if (!text) return

    const table = /^\[\[?([^\]]+)\]\]?$/.exec(text)
    if (table) {
      if (text.startsWith('[[')) throw new Error(`第 ${index + 1} 行：暂不支持数组表 [[...]]`)
      const path = table[1]!.split('.').map((s) => s.trim()).filter(Boolean)
      if (!path.length) throw new Error(`第 ${index + 1} 行：表名为空`)
      current = ensureTable(root, path)
      return
    }

    const eq = text.indexOf('=')
    if (eq < 0) throw new Error(`第 ${index + 1} 行无法解析：${text}`)

    const rawKey = text.slice(0, eq).trim()
    const key = rawKey.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
    if (!key) throw new Error(`第 ${index + 1} 行：键名为空`)

    const rawValue = text.slice(eq + 1).trim()
    if (rawValue.startsWith('{')) throw new Error(`第 ${index + 1} 行：暂不支持内联表 {…}`)
    if (rawValue.startsWith('"""')) throw new Error(`第 ${index + 1} 行：暂不支持多行字符串`)

    current[key] = parseValue(rawValue)
  })

  return root
}

const SAMPLE = `[package]
name = "zttools"
version = "0.1.0"

[features]
pwa = true
legacy = false

[deps]
list = ["vue", "vite"]`

const logic: TextOpLogic = {
  OPS: [{ id: 'to-json', label: 'TOML → JSON', group: '转换' }],
  apply: (text) => JSON.stringify(parseToml(text), null, 2),
  sample: SAMPLE,
  inputLabel: 'TOML',
  outputLabel: 'JSON',
  autoRun: true,
  noChain: true,
}

export default logic
