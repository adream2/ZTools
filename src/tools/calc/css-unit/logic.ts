import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'value', label: '数值', type: 'number' as const, default: 16, step: 0.5 },
  {
    key: 'unit',
    label: '源单位',
    type: 'select' as const,
    default: 'px',
    options: [
      { label: 'px', value: 'px' },
      { label: 'rem', value: 'rem' },
      { label: 'em', value: 'em' },
      { label: '%（相对父级）', value: 'pct' },
      { label: 'vw', value: 'vw' },
      { label: 'vh', value: 'vh' },
    ],
  },
  { key: 'root', label: '根字号 px', type: 'number' as const, default: 16, min: 8, max: 32, hint: 'html 的 font-size' },
  { key: 'parent', label: '父级字号 px', type: 'number' as const, default: 16, min: 8, max: 100, hint: 'em / % 的参照' },
  { key: 'viewport', label: '视口宽度 px', type: 'number' as const, default: 1440, min: 320 },
]

const n = (v: number) => String(Number(v.toFixed(4)))

function compute(values: Record<string, string | number>): CalcResult[] {
  const value = Number(values.value)
  const root = Number(values.root) || 16
  const parent = Number(values.parent) || 16
  const viewport = Number(values.viewport) || 1440
  if (!Number.isFinite(value)) return [{ label: '结果', value: '请输入数值', emphasis: true }]

  // 全部换算到 px
  let px = value
  switch (values.unit) {
    case 'rem':
      px = value * root
      break
    case 'em':
      px = value * parent
      break
    case 'pct':
      px = (value / 100) * parent
      break
    case 'vw':
      px = (value / 100) * viewport
      break
    case 'vh':
      px = (value / 100) * viewport
      break
    default:
      px = value
  }

  const vh = viewport

  return [
    { label: '像素值', value: `${n(px)} px`, emphasis: true },
    { label: 'rem', value: `${n(px / root)} rem`, hint: `根字号 ${root}px` },
    { label: 'em', value: `${n(px / parent)} em`, hint: `父级 ${parent}px` },
    { label: '%', value: `${n((px / parent) * 100)} %`, hint: `相对父级 ${parent}px` },
    { label: 'vw', value: `${n((px / viewport) * 100)} vw`, hint: `视口 ${viewport}px` },
    { label: 'vh（按同宽估算）', value: `${n((px / vh) * 100)} vh` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'em 与 % 依赖父级字号，嵌套层级不同结果会变；rem 始终以根字号为准',
}

export default logic
