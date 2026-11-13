import type { TextOpLogic } from '@/components/templates/types'

type Schema = Record<string, unknown>

const DATE = /^\d{4}-\d{2}-\d{2}$/
const DATETIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const URI = /^https?:\/\//i

function inferString(value: string): Schema {
  if (UUID.test(value)) return { type: 'string', format: 'uuid' }
  if (DATETIME.test(value)) return { type: 'string', format: 'date-time' }
  if (DATE.test(value)) return { type: 'string', format: 'date' }
  if (EMAIL.test(value)) return { type: 'string', format: 'email' }
  if (URI.test(value)) return { type: 'string', format: 'uri' }
  return { type: 'string' }
}

function merge(a: Schema, b: Schema): Schema {
  if (a.type === b.type && typeof a.type === 'string') {
    if (a.type === 'object') {
      const pa = (a.properties ?? {}) as Record<string, Schema>
      const pb = (b.properties ?? {}) as Record<string, Schema>
      const properties: Record<string, Schema> = { ...pa }
      for (const [key, schema] of Object.entries(pb)) {
        properties[key] = key in properties ? merge(properties[key]!, schema) : schema
      }
      const required = [...new Set([...(a.required as string[] | undefined ?? []), ...(b.required as string[] | undefined ?? [])])]
      return { type: 'object', properties, ...(required.length ? { required } : {}) }
    }
    if (a.type === 'array') {
      const ia = a.items as Schema | undefined
      const ib = b.items as Schema | undefined
      if (!ia || !Object.keys(ia).length) return b
      if (!ib || !Object.keys(ib).length) return a
      return { type: 'array', items: merge(ia, ib) }
    }
    const out: Schema = { ...a }
    if (a.format !== b.format) delete out.format
    return out
  }

  const options = [...((a.anyOf as Schema[] | undefined) ?? [a]), ...((b.anyOf as Schema[] | undefined) ?? [b])]
  const unique: Schema[] = []
  for (const opt of options) {
    if (!unique.some((u) => JSON.stringify(u) === JSON.stringify(opt))) unique.push(opt)
  }
  return unique.length === 1 ? unique[0]! : { anyOf: unique }
}

function infer(value: unknown, depth = 0): Schema {
  if (depth > 6) return {}
  if (value === null || value === undefined) return { type: 'null' }
  if (Array.isArray(value)) {
    if (!value.length) return { type: 'array', items: {} }
    return { type: 'array', items: value.map((v) => infer(v, depth + 1)).reduce(merge) }
  }
  if (typeof value === 'object') {
    const properties: Record<string, Schema> = {}
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      properties[key] = infer(v, depth + 1)
    }
    const keys = Object.keys(properties)
    return { type: 'object', properties, ...(keys.length ? { required: keys } : {}) }
  }
  if (typeof value === 'string') return inferString(value)
  if (typeof value === 'number') return { type: Number.isInteger(value) ? 'integer' : 'number' }
  if (typeof value === 'boolean') return { type: 'boolean' }
  return {}
}

const SAMPLE = `{
  "id": 1,
  "name": "张三",
  "email": "me@example.com",
  "createdAt": "2026-11-13T10:00:00Z",
  "tags": ["vip", "new"],
  "profile": { "age": 28, "vip": true }
}`

const logic: TextOpLogic = {
  OPS: [{ id: 'schema', label: '生成 Schema', group: '转换' }],
  apply: (text) => {
    const parsed = JSON.parse(text) as unknown
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...infer(parsed),
    }
    return JSON.stringify(schema, null, 2)
  },
  sample: SAMPLE,
  inputLabel: 'JSON 样例',
  outputLabel: 'JSON Schema',
  autoRun: true,
  noChain: true,
}

export default logic
