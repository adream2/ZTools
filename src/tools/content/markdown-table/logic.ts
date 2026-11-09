import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'cols', label: '列数', type: 'number' as const, default: 3, min: 1, max: 12 },
  { key: 'rows', label: '数据行数', type: 'number' as const, default: 3, min: 1, max: 30 },
  {
    key: 'align',
    label: '对齐',
    type: 'select' as const,
    default: 'left',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
  },
  {
    key: 'syntax',
    label: '语法',
    type: 'select' as const,
    default: 'md',
    options: [
      { label: 'Markdown', value: 'md' },
      { label: '带竖线表格（Obsidian）', value: 'md' },
    ],
  },
  { key: 'blank', label: '留空单元格', type: 'switch' as const, default: true },
]

function generate(values: Record<string, string | number | boolean>): string {
  const cols = Math.min(12, Math.max(1, Number(values.cols) || 1))
  const rows = Math.min(30, Math.max(1, Number(values.rows) || 1))
  const align = String(values.align)

  const cell = values.blank ? '' : '内容'
  const sep =
    align === 'center' ? ':---:' : align === 'right' ? '---:' : ':---'

  const header = `| ${Array.from({ length: cols }, (_, i) => `列 ${i + 1}`).join(' | ')} |`
  const divider = `| ${Array.from({ length: cols }, () => sep).join(' | ')} |`
  const body = Array.from({ length: rows }, () => `| ${Array.from({ length: cols }, () => cell).join(' | ')} |`)

  return [header, divider, ...body].join('\n')
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '生成后直接粘贴到 Markdown 编辑器，再替换表头文字',
  resultLabel: '表格',
}

export default logic
