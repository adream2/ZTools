import type { CalcLogic, CalcResult } from '@/components/templates/types'
import { ATOMIC_MASS } from '../periodic-table/logic'

const FIELDS = [
  { key: 'formula', label: '化学式', type: 'text' as const, default: 'Ca(OH)2', hint: '区分大小写：Ca 不是 CA' },
]

/** 解析化学式，返回各元素原子个数；支持括号嵌套 */
export function countAtoms(raw: string): Record<string, number> {
  const s = raw.replace(/\s+/g, '')
  if (!s) throw new Error('化学式为空')
  let i = 0

  const readNumber = (): number => {
    let digits = ''
    while (i < s.length && /\d/.test(s[i]!)) {
      digits += s[i]
      i += 1
    }
    return digits ? Number(digits) : 1
  }

  const parse = (): Record<string, number> => {
    const counts: Record<string, number> = {}
    while (i < s.length) {
      const ch = s[i]!
      if (ch === '(') {
        i += 1
        const inner = parse()
        if (s[i] !== ')') throw new Error('括号没有配对')
        i += 1
        const n = readNumber()
        for (const [k, v] of Object.entries(inner)) counts[k] = (counts[k] ?? 0) + v * n
        continue
      }
      if (ch === ')') break
      if (/[A-Z]/.test(ch)) {
        let symbol = ch
        i += 1
        if (i < s.length && /[a-z]/.test(s[i]!)) {
          symbol += s[i]
          i += 1
        }
        if (!(symbol in ATOMIC_MASS)) throw new Error(`未知元素符号：${symbol}`)
        const n = readNumber()
        counts[symbol] = (counts[symbol] ?? 0) + n
        continue
      }
      throw new Error(`第 ${i + 1} 个字符无法识别：${ch}`)
    }
    return counts
  }

  const result = parse()
  if (i !== s.length) throw new Error('括号没有配对')
  if (!Object.keys(result).length) throw new Error('没有解析到元素')
  return result
}

function compute(values: Record<string, string | number>): CalcResult[] {
  let atoms: Record<string, number>
  try {
    atoms = countAtoms(String(values.formula ?? ''))
  } catch (e) {
    return [{ label: '结果', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  const entries = Object.entries(atoms).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((sum, [sym, n]) => sum + (ATOMIC_MASS[sym] ?? 0) * n, 0)
  const atomCount = entries.reduce((sum, [, n]) => sum + n, 0)

  const rows: CalcResult[] = [
    { label: '摩尔质量', value: `${total.toFixed(2)} g/mol`, emphasis: true, hint: `共 ${atomCount} 个原子` },
  ]

  for (const [sym, n] of entries) {
    const mass = (ATOMIC_MASS[sym] ?? 0) * n
    rows.push({
      label: `${sym}${n > 1 ? n : ''}`,
      value: `${((mass / total) * 100).toFixed(2)}%`,
      hint: `${n} × ${ATOMIC_MASS[sym]} = ${mass.toFixed(2)}`,
    })
  }

  rows.push({ label: '1 mol 质量', value: `${total.toFixed(2)} g` })
  rows.push({ label: '1 g 的物质的量', value: `${(1 / total).toFixed(4)} mol` })
  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '原子量取 IUPAC 常规值，计算结果保留两位小数',
}

export default logic
