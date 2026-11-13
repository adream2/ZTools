import type { TextOpLogic } from '@/components/templates/types'

type Obj = { [key: string]: string | Obj }

const SAMPLE = `[database]
host = 127.0.0.1
port = 3306

[cache]
driver = redis
ttl = 3600`

export function parseIni(src: string): Obj {
  const root: Obj = {}
  let current: Obj = root

  src.split(/\r?\n/).forEach((line, index) => {
    const text = line.trim()
    if (!text || text.startsWith(';') || text.startsWith('#')) return

    const head = /^\[([^\]]+)\]$/.exec(text)
    if (head) {
      const name = head[1]!.trim()
      if (!name) throw new Error(`第 ${index + 1} 行：section 名为空`)
      const exists = root[name]
      current = exists && typeof exists === 'object' ? exists : (root[name] = {})
      return
    }

    const eq = text.indexOf('=')
    if (eq < 0) throw new Error(`第 ${index + 1} 行无法解析：${text}`)
    const key = text.slice(0, eq).trim()
    const value = text.slice(eq + 1).trim().replace(/^"(.*)"$/, '$1')
    if (!key) throw new Error(`第 ${index + 1} 行：键名为空`)
    current[key] = value
  })

  return root
}

function serialize(value: unknown, path: string[], out: string[]): void {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    const key = path[path.length - 1]
    const raw = Array.isArray(value) ? value.join(',') : String(value)
    out.push(`${key} = ${raw}`)
    return
  }
  const entries = Object.entries(value as Record<string, unknown>)
  const scalars = entries.filter(([, v]) => v === null || typeof v !== 'object' || Array.isArray(v))
  for (const [key, v] of scalars) serialize(v, [key], out)
  const tables = entries.filter(([, v]) => v !== null && typeof v === 'object' && !Array.isArray(v))
  for (const [key, v] of tables) {
    if (out.length) out.push('')
    out.push(`[${[...path, key].join('.')}]`)
    serialize(v, [...path, key], out)
  }
}

export function toIni(json: unknown): string {
  if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('顶层必须是 JSON 对象')
  const out: string[] = []
  serialize(json, [], out)
  return out.join('\n')
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'ini-to-json', label: 'INI → JSON', group: '转换' },
    { id: 'json-to-ini', label: 'JSON → INI', group: '转换' },
  ],
  apply: (text, op) => {
    if (op === 'json-to-ini') return toIni(JSON.parse(text))
    return JSON.stringify(parseIni(text), null, 2)
  },
  sample: SAMPLE,
  inputLabel: '输入',
  outputLabel: '输出',
  autoRun: true,
  noChain: true,
}

export default logic
