import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'brightness', label: '亮度 %', type: 'number' as const, default: 100, min: 0, max: 200 },
  { key: 'contrast', label: '对比度 %', type: 'number' as const, default: 100, min: 0, max: 200 },
  { key: 'saturate', label: '饱和度 %', type: 'number' as const, default: 100, min: 0, max: 200 },
  { key: 'grayscale', label: '灰度 %', type: 'number' as const, default: 0, min: 0, max: 100 },
  { key: 'sepia', label: '复古 %', type: 'number' as const, default: 0, min: 0, max: 100 },
  { key: 'blur', label: '模糊 px', type: 'number' as const, default: 0, min: 0, max: 20 },
  { key: 'hue', label: '色相旋转 deg', type: 'number' as const, default: 0, min: 0, max: 360 },
  { key: 'invert', label: '反色 %', type: 'number' as const, default: 0, min: 0, max: 100 },
]

function generate(values: Record<string, string | number | boolean>): string {
  const parts: string[] = []
  const add = (name: string, v: unknown, unit: string, neutral: number) => {
    const n = Number(v)
    if (!Number.isFinite(n) || n === neutral) return
    parts.push(`${name}(${n}${unit})`)
  }

  add('brightness', values.brightness, '%', 100)
  add('contrast', values.contrast, '%', 100)
  add('saturate', values.saturate, '%', 100)
  add('grayscale', values.grayscale, '%', 0)
  add('sepia', values.sepia, '%', 0)
  add('blur', values.blur, 'px', 0)
  add('hue-rotate', values.hue, 'deg', 0)
  add('invert', values.invert, '%', 0)

  if (!parts.length) return 'filter: none;'
  return `filter: ${parts.join(' ')};`
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '中性值会被自动省略，输出更干净',
  resultLabel: 'CSS',
}

export default logic
