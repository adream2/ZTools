import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'camel', label: 'camelCase', group: '转换' },
  { id: 'pascal', label: 'PascalCase', group: '转换' },
  { id: 'snake', label: 'snake_case', group: '转换' },
  { id: 'kebab', label: 'kebab-case', group: '转换' },
  { id: 'constant', label: 'CONSTANT_CASE', group: '转换' },
  { id: 'dot', label: 'dot.case', group: '转换' },
]

/** 把任意写法切成词：处理 camelCase、snake_case、kebab-case、空格与数字边界 */
export function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9\u4e00-\u9fa5]+/)
    .flatMap((part) => part.split(/(?<=[a-zA-Z])(?=\d)|(?<=\d)(?=[a-zA-Z])/))
    .filter(Boolean)
    .map((w) => w.toLowerCase())
}

function convert(text: string, op: string): string {
  const words = splitWords(text)
  if (!words.length) return ''
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)

  switch (op) {
    case 'camel':
      return words[0] + words.slice(1).map(cap).join('')
    case 'pascal':
      return words.map(cap).join('')
    case 'snake':
      return words.join('_')
    case 'kebab':
      return words.join('-')
    case 'constant':
      return words.join('_').toUpperCase()
    case 'dot':
      return words.join('.')
    default:
      return text
  }
}

function apply(text: string, op: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() ? convert(line.trim(), op) : ''))
    .join('\n')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'userProfileName\nHTTPResponseCode\nsome_var_name',
  note: '一行一个变量名，支持批量',
  inputLabel: '原始命名',
  outputLabel: '结果',
}

export default logic
