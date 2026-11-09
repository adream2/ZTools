import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'tl', label: '左上', type: 'number' as const, default: 24, min: 0, max: 200 },
  { key: 'tr', label: '右上', type: 'number' as const, default: 24, min: 0, max: 200 },
  { key: 'br', label: '右下', type: 'number' as const, default: 24, min: 0, max: 200 },
  { key: 'bl', label: '左下', type: 'number' as const, default: 24, min: 0, max: 200 },
  { key: 'unit', label: '单位', type: 'select' as const, default: 'px', options: [{ label: 'px', value: 'px' }, { label: '%', value: '%' }] },
  { key: 'circle', label: '圆形', type: 'switch' as const, default: false },
]

function generate(values: Record<string, string | number | boolean>): string {
  const u = String(values.unit)
  if (values.circle) return 'border-radius: 50%;'
  const v = (k: string) => `${Math.max(0, Number(values[k]) || 0)}${u}`
  return `border-radius: ${v('tl')} ${v('tr')} ${v('br')} ${v('bl')};`
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '四角用不同数值可以做「叶子形」等不规则形状',
  resultLabel: 'CSS',
}

export default logic
