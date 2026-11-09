import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'js', label: 'JS 转义', group: '转义' },
  { id: 'unjs', label: 'JS 还原', group: '还原' },
  { id: 'sql', label: 'SQL 转义', group: '转义' },
  { id: 'json', label: 'JSON 转义', group: '转义' },
  { id: 'unjson', label: 'JSON 还原', group: '还原' },
  { id: 'regex', label: '正则转义', group: '转义' },
]

function jsEscape(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
}

function jsUnescape(text: string): string {
  return text.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (_m, seq: string) => {
    switch (seq[0]) {
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 't':
        return '\t'
      case 'b':
        return '\b'
      case 'f':
        return '\f'
      case '0':
        return '\0'
      case 'u':
        return String.fromCharCode(parseInt(seq.slice(1), 16))
      case 'x':
        return String.fromCharCode(parseInt(seq.slice(1), 16))
      default:
        return seq
    }
  })
}

function apply(text: string, op: string): string {
  switch (op) {
    case 'js':
      return jsEscape(text)
    case 'unjs':
      return jsUnescape(text)
    case 'sql':
      return text.replace(/'/g, "''").replace(/\\/g, '\\\\')
    case 'json':
      return JSON.stringify(text).slice(1, -1)
    case 'unjson':
      try {
        return JSON.parse(`"${text.replace(/"/g, '\\"')}"`) as string
      } catch {
        throw new Error('不是合法的 JSON 转义序列')
      }
    case 'regex':
      return text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
    default:
      return text
  }
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: `It's a "test"\\nwith\ttab`,
  note: 'SQL 转义按单引号双写处理，适用于 MySQL / PostgreSQL',
  inputLabel: '原始文本',
  outputLabel: '结果',
}

export default logic
