import type { TextOpLogic } from '@/components/templates/types'

const TABLE: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

export function toRoman(input: number): string {
  if (!Number.isInteger(input) || input < 1 || input > 3999) {
    throw new Error('罗马数字只支持 1–3999 的整数')
  }
  let n = input
  let out = ''
  for (const [value, symbol] of TABLE) {
    while (n >= value) {
      out += symbol
      n -= value
    }
  }
  return out
}

export function fromRoman(text: string): number {
  const s = text.trim().toUpperCase()
  if (!/^[IVXLCDM]+$/.test(s)) throw new Error('只能包含 I V X L C D M')
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const cur = VALUES[s[i]!] ?? 0
    const next = VALUES[s[i + 1]!] ?? 0
    total += cur < next ? -cur : cur
  }
  // 回写校验，拦掉 IIII、VX 这类非标准写法
  if (toRoman(total) !== s) throw new Error('不是标准罗马数字写法')
  return total
}

/** 一行一个数字时批量转换 */
function batch(text: string, fn: (line: string) => string): string {
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() ? fn(line.trim()) : ''))
    .join('\n')
}

export const OPS = [
  { id: 'toRoman', label: '数字 → 罗马', group: '转换' },
  { id: 'toNumber', label: '罗马 → 数字', group: '转换' },
]

export function apply(text: string, op: string): string {
  if (op === 'toRoman') {
    return batch(text, (line) => toRoman(Number(line)))
  }
  return batch(text, (line) => String(fromRoman(line)))
}

export const sample = '2026\n1999\n42'
export const note = '支持批量：一行一个，自动跳过空行'

const logic: TextOpLogic = { OPS, apply, sample, note, inputLabel: '数字或罗马数字', outputLabel: '结果' }
export default logic
