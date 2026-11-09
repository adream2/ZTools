import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'format', label: '格式化', group: '格式化' },
  { id: 'minify', label: '压成一行', group: '格式化' },
  { id: 'upper', label: '关键字大写', group: '整理' },
  { id: 'lower', label: '关键字小写', group: '整理' },
]

/** 需要换行的主子句，长的放前面避免被短的先匹配 */
const BREAK_BEFORE = [
  'UNION ALL',
  'LEFT OUTER JOIN',
  'RIGHT OUTER JOIN',
  'FULL OUTER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'CROSS JOIN',
  'GROUP BY',
  'ORDER BY',
  'INSERT INTO',
  'DELETE FROM',
  'UNION',
  'SELECT',
  'FROM',
  'WHERE',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'VALUES',
  'UPDATE',
  'SET',
  'JOIN',
  'ON',
  'AND',
  'OR',
]

const KEYWORDS = new Set(
  `select from where group by order having limit offset insert into values update set delete join left right inner outer cross on and or not null is in like between exists as union all distinct count sum avg min max case when then else end asc desc create table primary key foreign references index drop alter add column default`.split(
    ' ',
  ),
)

function tokenize(sql: string): string[] {
  // 保留字符串字面量，其余按空白与标点切开
  const tokens: string[] = []
  let i = 0
  while (i < sql.length) {
    const ch = sql[i]!
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1
      while (j < sql.length && sql[j] !== ch) {
        if (sql[j] === '\\') j++
        j++
      }
      tokens.push(sql.slice(i, j + 1))
      i = j + 1
      continue
    }
    if (/[,()]/.test(ch)) {
      tokens.push(ch)
      i++
      continue
    }
    let j = i
    while (j < sql.length && !/[\s,()'"]/.test(sql[j]!)) j++
    tokens.push(sql.slice(i, j))
    i = j
  }
  return tokens
}

function formatSql(sql: string): string {
  const tokens = tokenize(sql.replace(/\s+/g, ' ').trim())
  let out = ''
  let indent = 0

  for (let i = 0; i < tokens.length; i++) {
    const raw = tokens[i]!
    const upper = raw.toUpperCase()
    const prev = (tokens[i - 1] ?? '').toUpperCase()

    // 多词关键字合并判断
    const pair = `${upper} ${(tokens[i + 1] ?? '').toUpperCase()}`
    const isBreak = BREAK_BEFORE.includes(pair) || BREAK_BEFORE.includes(upper)

    if (upper === '(') {
      indent++
      out += ' ('
      continue
    }
    if (upper === ')') {
      indent = Math.max(0, indent - 1)
      out += ')'
      continue
    }
    if (upper === ',') {
      out += ',\n' + '  '.repeat(indent)
      continue
    }

    if (isBreak && BREAK_BEFORE.includes(pair)) {
      out += `\n${'  '.repeat(indent)}${pair}`
      i++
      continue
    }

    if (isBreak && prev !== '(') {
      out += `\n${'  '.repeat(indent)}${KEYWORDS.has(upper.toLowerCase()) ? upper : raw}`
      continue
    }

    out += ` ${KEYWORDS.has(upper.toLowerCase()) ? upper : raw}`
  }

  return out.trim()
}

function apply(text: string, op: string): string {
  if (op === 'minify') return text.replace(/\s+/g, ' ').trim()
  if (op === 'upper' || op === 'lower') {
    return tokenize(text)
      .map((t) => {
        const bare = t.replace(/[(),]/g, '')
        if (!KEYWORDS.has(bare.toLowerCase())) return t
        return op === 'upper' ? t.toUpperCase() : t.toLowerCase()
      })
      .join(' ')
      .replace(/\s+([,)])/g, '$1')
      .replace(/\(\s+/g, '(')
  }
  return formatSql(text)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'select id,name,count(*) from users u left join orders o on o.uid=u.id where u.age>18 and u.status=1 group by u.id order by count(*) desc limit 20',
  note: '自写词法，不依赖解析器；字符串字面量会被原样保留',
  inputLabel: 'SQL',
  outputLabel: '结果',
  noChain: true,
}

export default logic
