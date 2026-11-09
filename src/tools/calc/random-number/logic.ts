import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'min', label: '最小值', type: 'number' as const, default: 1 },
  { key: 'max', label: '最大值', type: 'number' as const, default: 100 },
  { key: 'count', label: '数量', type: 'number' as const, default: 1, min: 1, max: 500 },
  { key: 'unique', label: '不重复', type: 'switch' as const, default: true },
  { key: 'pad', label: '补零对齐', type: 'switch' as const, default: false },
]

/** 拒绝采样，避免取模偏差 */
function randomInt(min: number, max: number): number {
  const range = max - min + 1
  if (range <= 0) throw new Error('最大值必须大于最小值')
  const limit = Math.floor(0x100000000 / range) * range
  const buf = new Uint32Array(1)
  let v = 0
  do {
    crypto.getRandomValues(buf)
    v = buf[0] ?? 0
  } while (v >= limit)
  return min + (v % range)
}

function generate(values: Record<string, string | number | boolean>): string[] {
  const min = Math.floor(Number(values.min) || 0)
  const max = Math.floor(Number(values.max) || 0)
  const count = Math.min(500, Math.max(1, Number(values.count) || 1))
  if (max < min) throw new Error('最大值不能小于最小值')

  const width = String(max).length
  const fill = (n: number) => (values.pad ? String(n).padStart(width, '0') : String(n))

  if (!values.unique) {
    return Array.from({ length: count }, () => fill(randomInt(min, max)))
  }

  const range = max - min + 1
  if (count > range) throw new Error(`范围内只有 ${range} 个数，无法取出 ${count} 个不重复的`)

  const set = new Set<number>()
  while (set.size < count) set.add(randomInt(min, max))
  return [...set].map(fill)
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '使用 crypto.getRandomValues + 拒绝采样，不是 Math.random',
  resultLabel: '抽取结果',
}

export default logic
