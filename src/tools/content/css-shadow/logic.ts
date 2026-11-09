import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'x', label: '水平偏移', type: 'number' as const, default: 8, min: -50, max: 50 },
  { key: 'y', label: '垂直偏移', type: 'number' as const, default: 8, min: -50, max: 50 },
  { key: 'blur', label: '模糊', type: 'number' as const, default: 20, min: 0, max: 100 },
  { key: 'spread', label: '扩散', type: 'number' as const, default: 0, min: -50, max: 50 },
  { key: 'opacity', label: '不透明度 %', type: 'number' as const, default: 18, min: 1, max: 100 },
  { key: 'color', label: '颜色', type: 'text' as const, default: '#5b6cff', hint: 'HEX 或 rgb()' },
  { key: 'inset', label: '内阴影', type: 'switch' as const, default: false },
  { key: 'multi', label: '叠加柔和层', type: 'switch' as const, default: true },
]

function normalizeColor(input: string): string {
  const raw = input.trim()
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    const [r, g, b] = raw.slice(1).split('')
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return raw
}

function generate(values: Record<string, string | number | boolean>): string {
  const x = Number(values.x) || 0
  const y = Number(values.y) || 0
  const blur = Math.max(0, Number(values.blur) || 0)
  const spread = Number(values.spread) || 0
  const alpha = Math.min(100, Math.max(1, Number(values.opacity) || 18)) / 100
  const color = normalizeColor(String(values.color ?? '#5b6cff'))
  const inset = values.inset ? 'inset ' : ''

  const layers = [`${inset}${x}px ${y}px ${blur}px ${spread}px ${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`]

  if (values.multi && !values.inset) {
    layers.push(`${Math.round(x / 2)}px ${Math.round(y / 2)}px ${Math.round(blur / 2)}px ${spread}px ${color}${Math.round(alpha * 0.6 * 255).toString(16).padStart(2, '0')}`)
  }

  return `box-shadow: ${layers.join(',\n            ')};`
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '叠加两层可以让阴影更柔和，接近真实光照',
  resultLabel: 'CSS',
}

export default logic
