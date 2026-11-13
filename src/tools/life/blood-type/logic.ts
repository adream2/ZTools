import type { CalcLogic, CalcResult } from '@/components/templates/types'

const OPTIONS = [
  { label: 'A 型', value: 'A' },
  { label: 'B 型', value: 'B' },
  { label: 'AB 型', value: 'AB' },
  { label: 'O 型', value: 'O' },
]

const FIELDS = [
  { key: 'father', label: '父亲血型', type: 'select' as const, default: 'A', options: OPTIONS },
  { key: 'mother', label: '母亲血型', type: 'select' as const, default: 'B', options: OPTIONS },
]

/** 表现型 → 可能携带的等位基因 */
const ALLELES: Record<string, string[]> = {
  A: ['A', 'O'],
  B: ['B', 'O'],
  AB: ['A', 'B'],
  O: ['O'],
}

function phenotype(a: string, b: string): string {
  if (a === 'O' && b === 'O') return 'O'
  if (a === 'A' && b === 'B') return 'AB'
  if (a === 'B' && b === 'A') return 'AB'
  if (a === 'O') return b
  if (b === 'O') return a
  return a
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const f = String(values.father)
  const m = String(values.mother)
  if (!ALLELES[f] || !ALLELES[m]) return [{ label: '结果', value: '请选择父母血型', emphasis: true }]

  const counts = new Map<string, number>()
  for (const fa of ALLELES[f]!) {
    for (const ma of ALLELES[m]!) {
      const child = phenotype(fa, ma)
      counts.set(child, (counts.get(child) ?? 0) + 1)
    }
  }

  const possible = ['A', 'B', 'AB', 'O'].filter((t) => counts.has(t))
  const impossible = ['A', 'B', 'AB', 'O'].filter((t) => !counts.has(t))
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  const detail = possible.map((t) => `${t} ${Math.round(((counts.get(t) ?? 0) / total) * 100)}%`).join(' / ')

  return [
    { label: '子女可能血型', value: possible.join('、') + ' 型', emphasis: true, hint: detail },
    { label: '不可能出现', value: impossible.length ? `${impossible.join('、')} 型` : '四种都可能' },
    { label: '概率明细', value: possible.map((t) => `${t} ${((counts.get(t) ?? 0) / total) * 100}%`).join('，') },
    { label: '父母基因型', value: `${f}: ${ALLELES[f]!.join('/')} × ${m}: ${ALLELES[m]!.join('/')}` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '概率按等位基因随机组合估算，实际人群分布并不均匀',
}

export default logic
