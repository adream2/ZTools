import type { TextOpLogic } from '@/components/templates/types'

function parseValue(raw: string): unknown {
  const text = raw.trim()
  if (!text) return null
  if (/^null$/i.test(text)) return null
  if (/^true$/i.test(text)) return true
  if (/^false$/i.test(text)) return false
  if (text.startsWith("'") && text.endsWith("'") && text.length >= 2) {
    return text.slice(1, -1).replace(/''/g, "'").replace(/\\'/g, "'").replace(/\\"/g, '"')
  }
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(text)) return Number(text)
  return text
}

export function sqlToJson(sql: string): Record<string, unknown>[] | unknown[][] {
  const text = sql.trim().replace(/;+\s*$/, '')
  const head = /INSERT\s+INTO\s+[`"[]?([\w.]+)[`"\]]?\s*(?:\(([^)]*)\))?\s*VALUES\s*([\s\S]*)$/i.exec(text)
  if (!head) throw new Error('没找到 INSERT INTO … VALUES … 语句')

  const columns = head[2]
    ? head[2]
        .split(',')
        .map((c) => c.trim().replace(/^[`"[]|[`"\]]$/g, ''))
        .filter(Boolean)
    : null
  const body = head[3] ?? ''

  const rows: unknown[][] = []
  let i = 0
  while (i < body.length) {
    while (i < body.length && body[i] !== '(') i += 1
    if (i >= body.length) break
    i += 1

    const values: unknown[] = []
    let cur = ''
    let inString = false
    let quote = ''
    let depth = 0
    let closed = false

    while (i < body.length) {
      const ch = body[i]!
      if (inString) {
        if (ch === '\\') {
          cur += ch + (body[i + 1] ?? '')
          i += 2
          continue
        }
        if (ch === quote) {
          if (body[i + 1] === quote) {
            cur += ch
            i += 2
            continue
          }
          inString = false
          cur += ch
          i += 1
          continue
        }
        cur += ch
        i += 1
        continue
      }
      if (ch === "'" || ch === '"') {
        inString = true
        quote = ch
        cur += ch
        i += 1
        continue
      }
      if (ch === '(') depth += 1
      if (ch === ')') {
        if (depth === 0) {
          i += 1
          closed = true
          break
        }
        depth -= 1
      }
      if (ch === ',' && depth === 0) {
        values.push(parseValue(cur))
        cur = ''
        i += 1
        continue
      }
      cur += ch
      i += 1
    }

    if (!closed) throw new Error('括号没有配对，检查 VALUES 里的字符串是否漏了引号')
    if (cur.trim()) values.push(parseValue(cur))
    if (values.length) rows.push(values)
  }

  if (!rows.length) throw new Error('VALUES 里没有解析到数据行')
  if (!columns) return rows
  return rows.map((row) => Object.fromEntries(columns.map((c, idx) => [c, row[idx] ?? null])))
}

const SAMPLE = `INSERT INTO users (id, name, age, active)
VALUES
  (1, '张三', 28, true),
  (2, 'O''Brien', 34, false),
  (3, NULL, NULL, true);`

const logic: TextOpLogic = {
  OPS: [{ id: 'to-json', label: 'SQL → JSON', group: '转换' }],
  apply: (text) => JSON.stringify(sqlToJson(text), null, 2),
  sample: SAMPLE,
  inputLabel: 'SQL',
  outputLabel: 'JSON',
  autoRun: true,
  noChain: true,
}

export default logic
