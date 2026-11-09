import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'insert', label: '生成 INSERT', group: 'SQL' },
  { id: 'create', label: '生成 CREATE TABLE', group: 'SQL' },
  { id: 'both', label: '建表 + 插入', group: 'SQL' },
]

interface Table {
  headers: string[]
  rows: string[][]
}

function parse(text: string, sep = ','): Table {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) throw new Error('至少需要表头 + 一行数据')

  const split = (line: string): string[] => {
    const out: string[] = []
    let cur = ''
    let quoted = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"'
          i++
        } else if (ch === '"') quoted = false
        else cur += ch
      } else if (ch === '"') quoted = true
      else if (ch === sep) {
        out.push(cur)
        cur = ''
      } else cur += ch
    }
    out.push(cur)
    return out.map((c) => c.trim())
  }

  const headers = split(lines[0]!)
  const rows = lines.slice(1).map(split)
  return { headers, rows }
}

function ident(name: string): string {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) ? name : `\`${name.replace(/`/g, '')}\``
}

function isNumeric(value: string): boolean {
  return value !== '' && /^-?\d+(\.\d+)?$/.test(value)
}

function literal(value: string): string {
  if (value === '' || value.toLowerCase() === 'null') return 'NULL'
  if (isNumeric(value)) return value
  return `'${value.replace(/'/g, "''")}'`
}

function inferType(index: number, table: Table): string {
  const values = table.rows.map((r) => r[index] ?? '').filter((v) => v !== '')
  if (values.length && values.every(isNumeric)) {
    return values.every((v) => !v.includes('.')) ? 'INT' : 'DECIMAL(12,2)'
  }
  const maxLen = Math.max(...values.map((v) => v.length), 1)
  return maxLen > 255 ? 'TEXT' : `VARCHAR(${Math.min(255, Math.max(16, maxLen * 2))})`
}

function build(table: Table, tableName: string): { create: string; insert: string } {
  const name = ident(tableName)

  const columns = table.headers
    .map((h, i) => `  ${ident(h)} ${inferType(i, table)}${i === 0 ? ' PRIMARY KEY' : ''}`)
    .join(',\n')
  const create = `CREATE TABLE ${name} (\n${columns}\n);`

  const values = table.rows
    .map((row) => `  (${table.headers.map((_, i) => literal(row[i] ?? '')).join(', ')})`)
    .join(',\n')

  const insert = `INSERT INTO ${name} (${table.headers.map((h) => ident(h)).join(', ')}) VALUES\n${values};`
  return { create, insert }
}

function apply(text: string, op: string): string {
  const table = parse(text)
  const name = 'my_table'
  const { create, insert } = build(table, name)
  if (op === 'create') return create
  if (op === 'both') return `${create}\n\n${insert}`
  return insert
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'id,name,price,stock\n1,机械键盘,399,20\n2,显示器,1299,8\n3,鼠标,99,50',
  note: '自动推断 INT / DECIMAL / VARCHAR；类型不理想时请手动调整',
  inputLabel: 'CSV（首行表头）',
  outputLabel: 'SQL',
  noChain: true,
}

export default logic
