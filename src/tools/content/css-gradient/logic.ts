import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'type',
    label: '类型',
    type: 'select' as const,
    default: 'linear',
    options: [
      { label: '线性', value: 'linear' },
      { label: '径向', value: 'radial' },
      { label: '锥形', value: 'conic' },
    ],
  },
  { key: 'angle', label: '角度 / 位置', type: 'text' as const, default: '135deg', hint: '径向可填 circle at 50% 50%' },
  { key: 'c1', label: '起始色', type: 'text' as const, default: '#5b6cff' },
  { key: 'p1', label: '起始位置 %', type: 'number' as const, default: 0, min: 0, max: 100 },
  { key: 'c2', label: '中间色（留空跳过）', type: 'text' as const, default: '#9a8dff' },
  { key: 'p2', label: '中间位置 %', type: 'number' as const, default: 50, min: 0, max: 100 },
  { key: 'c3', label: '结束色', type: 'text' as const, default: '#3fc9a4' },
  { key: 'p3', label: '结束位置 %', type: 'number' as const, default: 100, min: 0, max: 100 },
]

function generate(values: Record<string, string | number | boolean>): string {
  const type = String(values.type)
  const stops: string[] = []

  const push = (color: unknown, pos: unknown) => {
    const c = String(color ?? '').trim()
    if (!c) return
    const p = Number(pos)
    stops.push(`${c} ${Number.isFinite(p) ? p : 0}%`)
  }

  push(values.c1, values.p1)
  push(values.c2, values.p2)
  push(values.c3, values.p3)

  if (stops.length < 2) throw new Error('至少需要两个颜色')

  const prefix =
    type === 'linear'
      ? `linear-gradient(${String(values.angle || '135deg')}`
      : type === 'radial'
        ? `radial-gradient(${String(values.angle || 'circle at 50% 50%')}`
        : `conic-gradient(${String(values.angle || 'from 0deg')}`

  return `background: ${prefix}, ${stops.join(', ')});`
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '中间色留空即可生成双色渐变',
  resultLabel: 'CSS',
}

export default logic
