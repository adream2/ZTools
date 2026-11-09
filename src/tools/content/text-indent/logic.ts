import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'indent2', label: '首行缩进 2 字', group: '缩进' },
  { id: 'indent4', label: '首行缩进 4 字', group: '缩进' },
  { id: 'noIndent', label: '取消缩进', group: '缩进' },
  { id: 'spacing', label: '段间空一行', group: '段距' },
  { id: 'tight', label: '去掉所有空行', group: '段距' },
  { id: 'single', label: '合并为单段', group: '段距' },
]

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function apply(text: string, op: string): string {
  const list = paragraphs(text)
  switch (op) {
    case 'indent2':
      return list.map((p) => `　　${p}`).join('\n\n')
    case 'indent4':
      return list.map((p) => `　　　　${p}`).join('\n\n')
    case 'noIndent':
      return list.map((p) => p.replace(/^[　\s]+/, '')).join('\n\n')
    case 'spacing':
      return list.join('\n\n')
    case 'tight':
      return list.join('\n')
    case 'single':
      return list.join('')
    default:
      return text
  }
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '第一段内容，讲清楚背景。\n\n第二段内容，展开细节。\n第三段，收尾。',
  note: '缩进使用全角空格，复制到公众号编辑器不会丢',
  inputLabel: '原文',
  outputLabel: '排版结果',
}

export default logic
