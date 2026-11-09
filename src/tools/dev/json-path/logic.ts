export interface PathStep {
  label: string
  value: string
}

export interface QueryResult {
  value: unknown
  text: string
  type: string
  steps: PathStep[]
}

function typeName(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return `数组（${value.length} 项）`
  if (typeof value === 'object') return `对象（${Object.keys(value as object).length} 个键）`
  return typeof value
}

/** 把 a.b[0].c、$.a.b、[2] 统一成 token 数组 */
function tokenize(path: string): string[] {
  const clean = path.trim().replace(/^\$\.?/, '')
  if (!clean) return []
  return clean.match(/[^.[\]]+/g) ?? []
}

export function query(json: string, path: string): QueryResult {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch (e) {
    throw new Error(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
  }

  const tokens = tokenize(path)
  const steps: PathStep[] = []
  let current: unknown = data

  for (const token of tokens) {
    if (Array.isArray(current)) {
      const index = Number(token)
      if (!Number.isInteger(index)) throw new Error(`「${token}」不是数组下标`)
      if (index < 0 || index >= current.length) throw new Error(`下标 ${index} 越界（长度 ${current.length}）`)
      current = current[index]
      steps.push({ label: `[${index}]`, value: typeName(current) })
    } else if (current !== null && typeof current === 'object') {
      const record = current as Record<string, unknown>
      if (!(token in record)) {
        const keys = Object.keys(record).slice(0, 8)
        throw new Error(`键「${token}」不存在。可用键：${keys.join('、')}${Object.keys(record).length > 8 ? '…' : ''}`)
      }
      current = record[token]
      steps.push({ label: token, value: typeName(current) })
    } else {
      throw new Error(`路径在「${token}」处中断，上一级是 ${typeName(current)}`)
    }
  }

  const text =
    typeof current === 'string'
      ? current
      : current === undefined
        ? 'undefined'
        : JSON.stringify(current, null, 2)

  return { value: current, text, type: typeName(current), steps }
}

export function listPaths(json: string, limit = 60): string[] {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return []
  }

  const out: string[] = []
  const walk = (value: unknown, prefix: string): void => {
    if (out.length >= limit) return
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.slice(0, 3).forEach((v, i) => walk(v, `${prefix}[${i}]`))
      } else {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          const next = prefix ? `${prefix}.${k}` : k
          out.push(next)
          walk(v, next)
        }
      }
    }
  }
  walk(data, '')
  return out.slice(0, limit)
}
