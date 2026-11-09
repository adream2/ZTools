import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'toCsv', label: 'JSON → CSV', group: '转换' },
  { id: 'toTsv', label: 'JSON → TSV', group: '转换' },
  { id: 'fromCsv', label: 'CSV → JSON', group: '转换' },
]

function cell(value: unknown, sep: string): string {
  if (value === null || value === undefined) return ''
  let text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  if (text.includes('"') || text.includes(sep) || text.includes('\n') || text.includes('\r')) {
    text = `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function toCsv(text: string, sep = ','): string {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
  }
  const rows = Array.isArray(data) ? data : [data]
  if (!rows.length) return ''
  if (typeof rows[0] !== 'object' || rows[0] === null) {
    throw new Error('需要对象数组，例如 [{"a":1},{"a":2}]')
  }

  const keys: string[] = []
  for (const row of rows) {
    for (const key of Object.keys(row as Record<string, unknown>)) {
      if (!keys.includes(key)) keys.push(key)
    }
  }

  const header = keys.map((k) => cell(k, sep)).join(sep)
  const body = rows.map((row) => keys.map((k) => cell((row as Record<string, unknown>)[k], sep)).join(sep))
  return [header, ...body].join('\n')
}

function splitLine(line: string, sep: string): string[] {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') {
        quoted = false
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === sep) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

function cast(value: string): unknown {
  if (value === '') return ''
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  const n = Number(value)
  return Number.isFinite(n) && String(n) === value ? n : value
}

export function fromCsv(text: string, sep = ','): string {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) throw new Error('至少需要表头 + 一行数据')
  const headers = splitLine(lines[0]!, sep)
  const rows = lines.slice(1).map((line) => {
    const cells = splitLine(line, sep)
    const obj: Record<string, unknown> = {}
    headers.forEach((h, i) => (obj[h] = cast(cells[i] ?? '')))
    return obj
  })
  return JSON.stringify(rows, null, 2)
}

function apply(text: string, op: string): string {
  if (op === 'toTsv') return toCsv(text, '\t')
  if (op === 'fromCsv') return fromCsv(text, text.includes('\t') && !text.includes(',') ? '\t' : ',')
  return toCsv(text, ',')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '[{"id":1,"name":"张三","tags":["a","b"]},{"id":2,"name":"李四","tags":[]}]',
  note: '嵌套对象会序列化成 JSON 字符串放进单元格',
  inputLabel: 'JSON 或 CSV',
  outputLabel: '结果',
  noChain: true,
}

export default logic
