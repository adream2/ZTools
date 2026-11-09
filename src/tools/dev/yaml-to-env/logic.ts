import { parse as parseYaml } from 'yaml'
import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'yaml', label: 'YAML → .env', group: '转换' },
  { id: 'json', label: 'JSON → .env', group: '转换' },
  { id: 'docker', label: '生成 docker-compose environment', group: '输出' },
]

type Value = unknown

function flatten(value: Value, prefix = '', out: Record<string, string> = {}): Record<string, string> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value as Record<string, Value>)) {
      flatten(v, prefix ? `${prefix}_${k}` : k, out)
    }
  } else if (Array.isArray(value)) {
    out[prefix] = value.join(',')
  } else if (value === null || value === undefined) {
    out[prefix] = ''
  } else {
    out[prefix] = String(value)
  }
  return out
}

function normalizeKey(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toUpperCase()
}

function quote(value: string): string {
  if (value === '') return '""'
  if (/[\s#'"\\]/.test(value)) return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  return value
}

function toEnv(flat: Record<string, string>): string {
  return Object.entries(flat)
    .map(([k, v]) => `${normalizeKey(k)}=${quote(v)}`)
    .join('\n')
}

function toComposeEnv(flat: Record<string, string>): string {
  return ['    environment:', ...Object.entries(flat).map(([k, v]) => `      ${normalizeKey(k)}: "${v.replace(/"/g, '\\"')}"`)].join(
    '\n',
  )
}

function apply(text: string, op: string): string {
  if (!text.trim()) throw new Error('请输入配置内容')

  let data: Value
  if (op === 'yaml') {
    try {
      data = parseYaml(text, { schema: 'core', maxAliasCount: 100 })
    } catch (e) {
      throw new Error(`YAML 解析失败：${e instanceof Error ? e.message : String(e)}`)
    }
  } else {
    try {
      data = JSON.parse(text)
    } catch (e) {
      throw new Error(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
    }
  }

  if (data === null || typeof data !== 'object') throw new Error('顶层需要是对象')
  const flat = flatten(data)
  return op === 'docker' ? toComposeEnv(flat) : toEnv(flat)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: `app:
  name: zt-tools
  port: 8080
database:
  host: localhost
  user: root
  password: "p@ss word"
features:
  - json
  - yaml`,
  note: '嵌套键用下划线连接并转大写；含空格或特殊字符的值会自动加引号',
  inputLabel: 'YAML 或 JSON',
  outputLabel: '结果',
  noChain: true,
}

export default logic
