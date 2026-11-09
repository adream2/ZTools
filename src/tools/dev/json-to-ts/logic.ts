import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'ts', label: 'TS interface', group: 'TypeScript' },
  { id: 'type', label: 'TS type', group: 'TypeScript' },
  { id: 'zod', label: 'Zod schema', group: '校验' },
  { id: 'go', label: 'Go struct', group: 'Go' },
]

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/

function pascal(name: string): string {
  return name
    .replace(/[^A-Za-z0-9]+(.)?/g, (_m, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase()) || 'Item'
}

function keyName(name: string): string {
  return IDENT.test(name) ? name : JSON.stringify(name)
}

function tsType(value: Json, name: string, interfaces: string[]): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (!value.length) return 'unknown[]'
    const inner = tsType(value[0] as Json, name, interfaces)
    return inner.includes('|') ? `Array<${inner}>` : `${inner}[]`
  }
  if (typeof value === 'object') {
    const ifaceName = pascal(name)
    interfaces.push(buildInterface(value as Record<string, Json>, ifaceName, interfaces, 'interface'))
    return ifaceName
  }
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'unknown'
}

function buildInterface(obj: Record<string, Json>, name: string, interfaces: string[], kind: 'interface' | 'type'): string {
  const lines = Object.entries(obj).map(([key, val]) => {
    const t = tsType(val, `${name}_${key}`, interfaces)
    return `  ${keyName(key)}: ${t};`
  })
  const body = lines.join('\n')
  return kind === 'interface' ? `export interface ${name} {\n${body}\n}` : `export type ${name} = {\n${body}\n};`
}

function zodType(value: Json, name: string, defs: string[]): string {
  if (value === null) return 'z.null()'
  if (Array.isArray(value)) {
    if (!value.length) return 'z.array(z.unknown())'
    return `z.array(${zodType(value[0] as Json, name, defs)})`
  }
  if (typeof value === 'object') {
    const schemaName = pascal(name)
    const fields = Object.entries(value as Record<string, Json>)
      .map(([k, v]) => `  ${keyName(k)}: ${zodType(v, `${schemaName}_${k}`, defs)},`)
      .join('\n')
    defs.push(`export const ${schemaName}Schema = z.object({\n${fields}\n});`)
    return `${schemaName}Schema`
  }
  if (typeof value === 'string') return 'z.string()'
  if (typeof value === 'number') return 'z.number()'
  if (typeof value === 'boolean') return 'z.boolean()'
  return 'z.unknown()'
}

function goType(value: Json, name: string, structs: string[]): string {
  if (value === null) return 'any'
  if (Array.isArray(value)) {
    if (!value.length) return '[]any'
    return `[]${goType(value[0] as Json, name, structs)}`
  }
  if (typeof value === 'object') {
    const structName = pascal(name)
    const fields = Object.entries(value as Record<string, Json>)
      .map(([k, v]) => {
        const field = pascal(k)
        const t = goType(v, `${structName}_${k}`, structs)
        return `\t${field} ${t} \`json:"${k}"\``
      })
      .join('\n')
    structs.push(`type ${structName} struct {\n${fields}\n}`)
    return structName
  }
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return Number.isInteger(value) ? 'int64' : 'float64'
  if (typeof value === 'boolean') return 'bool'
  return 'any'
}

function rootName(text: string): string {
  // 从形如 const data = {...} 的片段里猜一个名字，没有就用 Root
  const m = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)/.exec(text)
  return m?.[1] ?? 'Root'
}

function apply(text: string, op: string): string {
  const name = rootName(text)
  let value: Json
  try {
    value = JSON.parse(text) as Json
  } catch (e) {
    throw new Error(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
  }

  if (op === 'zod') {
    const defs: string[] = []
    zodType(value, name, defs)
    return `import { z } from 'zod';\n\n${defs.join('\n\n')}`
  }

  if (op === 'go') {
    const structs: string[] = []
    goType(value, name, structs)
    return structs.join('\n\n')
  }

  const interfaces: string[] = []
  const head = tsType(value, name, interfaces)
  const kind = op === 'type' ? 'type' : 'interface'
  if (head === pascal(name)) return interfaces.join('\n\n')
  return `${kind === 'type' ? 'export type' : 'export interface'} ${pascal(name)} = ${head};`
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '{"id":1,"name":"zt","tags":["a","b"],"meta":{"ok":true,"score":9.5}}',
  note: '数组按首个元素推断类型；字段名不合法时会自动加引号',
  inputLabel: 'JSON',
  outputLabel: '生成的类型',
  noChain: true,
}

export default logic
