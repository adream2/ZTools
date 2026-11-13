import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'mode',
    label: '题型',
    type: 'select' as const,
    default: 'mix',
    options: [
      { label: '加减混合', value: 'mix' },
      { label: '只加法', value: 'add' },
      { label: '只减法', value: 'sub' },
      { label: '表内乘法', value: 'mul' },
    ],
  },
  {
    key: 'range',
    label: '数值范围',
    type: 'select' as const,
    default: 20,
    options: [
      { label: '20 以内', value: 20 },
      { label: '50 以内', value: 50 },
      { label: '100 以内', value: 100 },
    ],
  },
  { key: 'count', label: '题数', type: 'number' as const, default: 10, min: 1, max: 100 },
]

const rand = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

const logic: GeneratorLogic = {
  FIELDS,
  generate: (values) => {
    const mode = String(values.mode)
    const range = Math.max(10, Math.round(Number(values.range)) || 20)
    const count = Math.min(100, Math.max(1, Math.round(Number(values.count)) || 10))

    const out: { label: string; value: string }[] = []
    for (let i = 1; i <= count; i += 1) {
      const kind = mode === 'mix' ? (['add', 'sub', 'mul'] as const)[rand(0, 2)]! : mode

      if (kind === 'mul') {
        const a = rand(2, 9)
        const b = rand(2, 9)
        out.push({ label: `${i}. ${a} × ${b} =`, value: String(a * b) })
        continue
      }

      const a = rand(1, range)
      const b = rand(1, range)
      if (kind === 'add') {
        out.push({ label: `${i}. ${a} + ${b} =`, value: String(a + b) })
      } else {
        const big = Math.max(a, b)
        const small = Math.min(a, b)
        out.push({ label: `${i}. ${big} − ${small} =`, value: String(big - small) })
      }
    }
    return out
  },
  resultLabel: '题目（含答案）',
  note: '每次点击生成都会重新随机，适合反复练习',
}

export default logic
