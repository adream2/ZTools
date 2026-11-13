import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'max', label: '最大乘数', type: 'number' as const, default: 9, min: 2, max: 12 },
  {
    key: 'style',
    label: '形式',
    type: 'select' as const,
    default: 'half',
    options: [
      { label: '下三角（课本九九表）', value: 'half' },
      { label: '完整表（含交换）', value: 'full' },
      { label: '按乘数分行', value: 'row' },
    ],
  },
]

const logic: GeneratorLogic = {
  FIELDS,
  generate: (values) => {
    const max = Math.max(2, Math.min(12, Math.round(Number(values.max)) || 9))
    const style = String(values.style)

    if (style === 'row') {
      const lines: string[] = []
      for (let a = 1; a <= max; a += 1) {
        const cells = Array.from({ length: max }, (_, i) => `${a}×${i + 1}=${a * (i + 1)}`)
        lines.push(cells.join('  '))
      }
      return lines
    }

    const lines: string[] = []
    for (let a = 1; a <= max; a += 1) {
      const cells: string[] = []
      for (let b = 1; b <= (style === 'half' ? a : max); b += 1) {
        cells.push(`${b}×${a}=${a * b}`)
      }
      lines.push(cells.join('  '))
    }
    return lines
  },
  resultLabel: '口诀表',
  note: '每行一个乘数，可直接复制到文档里打印',
}

export default logic
