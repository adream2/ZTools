export type OpId =
  | 'upper'
  | 'lower'
  | 'title'
  | 'trim'
  | 'dedupe'
  | 'sort'
  | 'sortDesc'
  | 'removeEmpty'
  | 'numberLines'
  | 'reverseLines'
  | 'joinLines'
  | 'splitToLines'
  | 'stripHtml'
  | 'fullToHalf'

export const OPS: { id: OpId; label: string; group: string }[] = [
  { id: 'upper', label: '全部大写', group: '大小写' },
  { id: 'lower', label: '全部小写', group: '大小写' },
  { id: 'title', label: '首字母大写', group: '大小写' },
  { id: 'trim', label: '去每行首尾空格', group: '清理' },
  { id: 'removeEmpty', label: '删除空行', group: '清理' },
  { id: 'stripHtml', label: '去掉 HTML 标签', group: '清理' },
  { id: 'dedupe', label: '按行去重', group: '整理' },
  { id: 'sort', label: '升序排序', group: '整理' },
  { id: 'sortDesc', label: '降序排序', group: '整理' },
  { id: 'reverseLines', label: '反转行序', group: '整理' },
  { id: 'numberLines', label: '添加行号', group: '整理' },
  { id: 'joinLines', label: '合并为一行', group: '转换' },
  { id: 'splitToLines', label: '按标点拆行', group: '转换' },
  { id: 'fullToHalf', label: '全角转半角', group: '转换' },
]

export function applyOp(text: string, op: OpId): string {
  if (!text) return ''

  switch (op) {
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    case 'title':
      return text.replace(/(^|[\s.!?。！？])([a-z])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase())
    case 'trim':
      return text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .join('\n')
    case 'removeEmpty':
      return text
        .split(/\r?\n/)
        .filter((l) => l.trim())
        .join('\n')
    case 'stripHtml':
      return text
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
    case 'dedupe': {
      const seen = new Set<string>()
      const out: string[] = []
      for (const line of text.split(/\r?\n/)) {
        if (!seen.has(line)) {
          seen.add(line)
          out.push(line)
        }
      }
      return out.join('\n')
    }
    case 'sort':
      return text.split(/\r?\n/).sort((a, b) => a.localeCompare(b, 'zh-CN')).join('\n')
    case 'sortDesc':
      return text.split(/\r?\n/).sort((a, b) => b.localeCompare(a, 'zh-CN')).join('\n')
    case 'reverseLines':
      return text.split(/\r?\n/).reverse().join('\n')
    case 'numberLines': {
      const lines = text.split(/\r?\n/)
      const width = String(lines.length).length
      return lines.map((l, i) => `${String(i + 1).padStart(width, ' ')}. ${l}`).join('\n')
    }
    case 'joinLines':
      return text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .join(' ')
    case 'splitToLines':
      return text
        .split(/[。！？；，、,.!?;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .join('\n')
    case 'fullToHalf':
      return text.replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, ' ')
    default:
      return text
  }
}

export function summary(text: string): { lines: number; chars: number; bytes: number } {
  return {
    lines: text ? text.split(/\r?\n/).length : 0,
    chars: [...text].length,
    bytes: new TextEncoder().encode(text).length,
  }
}
