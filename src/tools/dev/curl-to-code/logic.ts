import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'fetch', label: 'fetch', group: 'JavaScript' },
  { id: 'axios', label: 'axios', group: 'JavaScript' },
  { id: 'python', label: 'Python requests', group: 'Python' },
]

interface Parsed {
  url: string
  method: string
  headers: Record<string, string>
  body: string
  auth: string
}

function tokenize(cmd: string): string[] {
  const src = cmd.replace(/\\\r?\n/g, ' ').trim()
  const tokens: string[] = []
  let i = 0
  while (i < src.length) {
    const ch = src[i]!
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (ch === "'" || ch === '"') {
      let j = i + 1
      let buf = ''
      while (j < src.length && src[j] !== ch) {
        if (src[j] === '\\' && ch === '"') {
          buf += src[j + 1]
          j += 2
          continue
        }
        buf += src[j]
        j++
      }
      tokens.push(buf)
      i = j + 1
      continue
    }
    let j = i
    while (j < src.length && !/\s/.test(src[j]!)) j++
    tokens.push(src.slice(i, j))
    i = j
  }
  return tokens
}

export function parseCurl(cmd: string): Parsed {
  const tokens = tokenize(cmd)
  if (!tokens.length) throw new Error('命令为空')
  if (tokens[0] !== 'cURL' && tokens[0] !== 'curl') {
    // 允许只粘贴参数部分
  }

  const parsed: Parsed = { url: '', method: '', headers: {}, body: '', auth: '' }

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!
    if (t === '-X' || t === '--request') {
      parsed.method = (tokens[++i] ?? '').toUpperCase()
    } else if (t === '-H' || t === '--header') {
      const raw = tokens[++i] ?? ''
      const idx = raw.indexOf(':')
      if (idx > 0) parsed.headers[raw.slice(0, idx).trim()] = raw.slice(idx + 1).trim()
    } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') {
      parsed.body = tokens[++i] ?? ''
    } else if (t === '-u' || t === '--user') {
      parsed.auth = tokens[++i] ?? ''
    } else if (t.startsWith('http://') || t.startsWith('https://')) {
      parsed.url = t
    } else if (!t.startsWith('-') && !parsed.url && /^[\w.-]+\.[a-z]{2,}/i.test(t)) {
      parsed.url = t.startsWith('http') ? t : `https://${t}`
    }
  }

  if (!parsed.url) throw new Error('没找到请求地址，确认命令里有 URL')
  if (!parsed.method) parsed.method = parsed.body ? 'POST' : 'GET'
  if (parsed.auth && !parsed.headers.Authorization) {
    parsed.headers.Authorization = `Basic ${btoa(parsed.auth)}`
  }
  return parsed
}

function isJson(headers: Record<string, string>, body: string): boolean {
  const ct = Object.entries(headers).find(([k]) => k.toLowerCase() === 'content-type')?.[1] ?? ''
  if (ct.includes('json')) return true
  const trimmed = body.trim()
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))
}

function headerLines(headers: Record<string, string>, indent: string): string {
  return Object.entries(headers)
    .map(([k, v]) => `${indent}${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n')
}

function toFetch(p: Parsed): string {
  const json = isJson(p.headers, p.body)
  const bodyValue = p.body ? (json ? `JSON.stringify(${prettyJson(p.body)})` : JSON.stringify(p.body)) : ''
  const parts: string[] = [`  method: '${p.method}',`]
  if (Object.keys(p.headers).length) parts.push(`  headers: {\n${headerLines(p.headers, '    ')}\n  },`)
  if (bodyValue) parts.push(`  body: ${bodyValue},`)

  return `const res = await fetch(${JSON.stringify(p.url)}, {
${parts.join('\n')}
});

if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();
console.log(data);`
}

function toAxios(p: Parsed): string {
  const json = isJson(p.headers, p.body)
  const method = p.method.toLowerCase()
  const args: string[] = [JSON.stringify(p.url)]
  if (p.body) args.push(json ? prettyJson(p.body) : JSON.stringify(p.body))
  if (Object.keys(p.headers).length) {
    args.push(`{ headers: {\n${headerLines(p.headers, '  ')}\n} }`)
  }

  return `import axios from 'axios';

const { data } = await axios.${method}(${args.join(', ')});
console.log(data);`
}

function toPython(p: Parsed): string {
  const json = isJson(p.headers, p.body)
  const lines = ['import requests', '']
  lines.push(`url = ${JSON.stringify(p.url)}`)
  if (Object.keys(p.headers).length) {
    lines.push('headers = {')
    for (const [k, v] of Object.entries(p.headers)) lines.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    lines.push('}')
  }
  if (p.body) {
    if (json) lines.push(`payload = ${prettyJson(p.body).replace(/"([^"]+)":/g, '"$1":')}`)
    else lines.push(`payload = ${JSON.stringify(p.body)}`)
  }
  const args = ['url']
  if (Object.keys(p.headers).length) args.push('headers=headers')
  if (p.body) args.push(json ? 'json=payload' : 'data=payload')
  args.push('timeout=10')
  lines.push('')
  lines.push(`resp = requests.${p.method.toLowerCase()}(${args.join(', ')})`)
  lines.push('resp.raise_for_status()')
  lines.push('print(resp.json())')
  return lines.join('\n')
}

function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return JSON.stringify(text)
  }
}

function apply(text: string, op: string): string {
  const parsed = parseCurl(text)
  if (op === 'axios') return toAxios(parsed)
  if (op === 'python') return toPython(parsed)
  return toFetch(parsed)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: `curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name":"张三","age":28}'`,
  note: '支持 -X / -H / -d / -u，复杂参数（--form、--cookie）会被忽略',
  inputLabel: 'curl 命令',
  outputLabel: '代码',
  noChain: true,
}

export default logic
