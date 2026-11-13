import type { TextOpLogic } from '@/components/templates/types'

/** 转义成 JSON 字符串内容（不含首尾引号） */
export function escapeJson(text: string): string {
  return JSON.stringify(text).slice(1, -1)
}

/** 反转义；失败时逐段替换，尽量不整段丢弃 */
export function unescapeJson(text: string): string {
  try {
    // 先把原文里未转义的引号补上，整体丢给 JSON.parse
    return JSON.parse(`"${text.replace(/(?<!\\)"/g, '\\"')}"`) as string
  } catch {
    return text.replace(/\\(u[0-9a-fA-F]{4}|["\\/bfnrt])/g, (all, seq: string) => {
      if (seq.startsWith('u')) return String.fromCharCode(Number.parseInt(seq.slice(1), 16))
      const map: Record<string, string> = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' }
      return map[seq] ?? all
    })
  }
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'escape', label: '转义', group: '转换' },
    { id: 'unescape', label: '反转义', group: '转换' },
    { id: 'quote', label: '加引号', group: '转换' },
  ],
  apply: (text, op) => {
    if (op === 'escape') return escapeJson(text)
    if (op === 'quote') return JSON.stringify(text)
    return unescapeJson(text)
  },
  sample: '他说："换行\n要转义"',
  inputLabel: '原文',
  outputLabel: '结果',
  autoRun: true,
}

export default logic
