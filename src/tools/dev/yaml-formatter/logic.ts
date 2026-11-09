import { parse, stringify } from 'yaml'

const PARSE_OPTIONS = { schema: 'core' as const, maxAliasCount: 100, strict: true }

export type YamlMode = 'yaml2json' | 'json2yaml'

export function yamlToJson(text: string, indent = 2): string {
  let value: unknown
  try {
    value = parse(text, PARSE_OPTIONS)
  } catch (e) {
    throw new Error(normalizeYamlError(e))
  }
  if (value === undefined) throw new Error('文档为空，或只包含注释')
  return JSON.stringify(value, null, indent)
}

export function jsonToYaml(text: string): string {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch (e) {
    throw new Error(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
  }
  return stringify(value, { indent: 2, lineWidth: 0, singleQuote: false })
}

export function convert(text: string, mode: YamlMode, indent = 2): string {
  return mode === 'yaml2json' ? yamlToJson(text, indent) : jsonToYaml(text)
}

export function normalizeYamlError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  return message.replace(/\n{2,}/g, '\n').trim()
}

export function countTopLevel(text: string): number {
  try {
    const value = parse(text, PARSE_OPTIONS) as unknown
    if (value && typeof value === 'object') return Object.keys(value as object).length
    return 1
  } catch {
    return 0
  }
}
