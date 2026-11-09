import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'flatten', label: '扁平化', group: '转换' },
  { id: 'unflatten', label: '还原嵌套', group: '转换' },
  { id: 'paths', label: '只列路径', group: '查看' },
]

type Json = null | boolean | number | string | Json[] | { [k: string]: Json }

function flatten(value: Json, prefix = '', out: Record<string, Json> = {}): Record<string, Json> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value)
    if (!entries.length) out[prefix || ''] = {}
    for (const [k, v] of entries) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out)
    }
  } else if (Array.isArray(value)) {
    if (!value.length) out[prefix] = []
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out))
  } else {
    out[prefix] = value
  }
  return out
}

function unflatten(flat: Record<string, Json>): Json {
  const root: Record<string, Json> = {}
  for (const [path, value] of Object.entries(flat)) {
    const tokens = path.match(/[^.[\]]+/g) ?? []
    let cursor: Record<string, Json> | Json[] = root

    tokens.forEach((token, i) => {
      const isIndex = /^\d+$/.test(token)
      const key: string | number = isIndex ? Number(token) : token
      const last = i === tokens.length - 1

      if (last) {
        if (Array.isArray(cursor)) cursor[Number(key)] = value
        else cursor[String(key)] = value
        return
      }

      const nextToken = tokens[i + 1]!
      const nextIsIndex = /^\d+$/.test(nextToken)
      const existing = Array.isArray(cursor) ? cursor[Number(key)] : cursor[String(key)]

      if (existing === undefined) {
        const created: Json = nextIsIndex ? [] : {}
        if (Array.isArray(cursor)) cursor[Number(key)] = created
        else cursor[String(key)] = created
        cursor = created as Record<string, Json> | Json[]
      } else {
        cursor = existing as Record<string, Json> | Json[]
      }
    })
  }
  return root
}

function apply(text: string, op: string): string {
  let data: Json
  try {
    data = JSON.parse(text) as Json
  } catch (e) {
    throw new Error(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
  }

  if (op === 'unflatten') {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('需要扁平对象，例如 {"a.b": 1}')
    }
    return JSON.stringify(unflatten(data as Record<string, Json>), null, 2)
  }

  const flat = flatten(data)
  if (op === 'paths') return Object.keys(flat).sort().join('\n')
  return JSON.stringify(flat, null, 2)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '{"user":{"name":"张三","tags":["a","b"]},"meta":{"ok":true,"list":[{"id":1}]}}',
  note: '数组用 [0] 表示下标；还原时按路径自动建对象或数组',
  inputLabel: 'JSON',
  outputLabel: '结果',
  noChain: true,
}

export default logic
