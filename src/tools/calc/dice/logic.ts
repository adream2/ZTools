import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'count', label: '骰子数量', type: 'number' as const, default: 2, min: 1, max: 20 },
  {
    key: 'sides',
    label: '面数',
    type: 'select' as const,
    default: '6',
    options: [
      { label: 'D4', value: '4' },
      { label: 'D6', value: '6' },
      { label: 'D8', value: '8' },
      { label: 'D10', value: '10' },
      { label: 'D12', value: '12' },
      { label: 'D20', value: '20' },
    ],
  },
  { key: 'showSum', label: '显示总和', type: 'switch' as const, default: true },
]

function rand(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  let v = 0
  do {
    crypto.getRandomValues(buf)
    v = buf[0] ?? 0
  } while (v >= limit)
  return (v % max) + 1
}

function faces(n: number): string {
  return ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][n - 1] ?? String(n)
}

function generate(values: Record<string, string | number | boolean>): string[] {
  const count = Math.min(20, Math.max(1, Number(values.count) || 1))
  const sides = Number(values.sides) || 6
  const rolls = Array.from({ length: count }, () => rand(sides))
  const out = rolls.map((r, i) => `第 ${i + 1} 个：${sides === 6 ? faces(r) + ' ' : ''}${r}`)
  if (values.showSum) out.push(`合计：${rolls.reduce((a, b) => a + b, 0)}`)
  return out
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '使用 crypto 随机源，与 Math.random 不同',
  resultLabel: '结果',
}

export default logic
