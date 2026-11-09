import type { GeneratorLogic } from '@/components/templates/types'

interface Rgb {
  r: number
  g: number
  b: number
}
interface Hsl {
  h: number
  s: number
  l: number
}

const clamp = (n: number, min = 0, max = 255) => Math.min(max, Math.max(min, n))

function hexToRgb(input: string): Rgb {
  const hex = input.trim().replace(/^#/, '')
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error('HEX 格式应为 #RRGGBB')
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((n) => clamp(Math.round(n)).toString(16).padStart(2, '0')).join('')}`
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = (((h % 360) + 360) % 360) / 360
  const sn = s / 100
  const ln = l / 100
  if (sn === 0) {
    const v = Math.round(ln * 255)
    return { r: v, g: v, b: v }
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hue2rgb = (t: number): number => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  return {
    r: Math.round(hue2rgb(hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(hn) * 255),
    b: Math.round(hue2rgb(hn - 1 / 3) * 255),
  }
}

const SCHEMES: Record<string, { label: string; offsets: number[] }> = {
  mono: { label: '单色（明度梯度）', offsets: [0, 0, 0, 0, 0] },
  analogous: { label: '类似色（±30°）', offsets: [0, -30, 30, -60, 60] },
  complementary: { label: '互补色（+180°）', offsets: [0, 180, 0, 180, 0] },
  triadic: { label: '三角色（+120°）', offsets: [0, 120, 240, 0, 120] },
  tetradic: { label: '四色（+90°）', offsets: [0, 90, 180, 270, 0] },
}

const FIELDS = [
  { key: 'base', label: '主色（HEX）', type: 'text' as const, default: '#5b6cff' },
  {
    key: 'scheme',
    label: '方案',
    type: 'select' as const,
    default: 'analogous',
    options: Object.entries(SCHEMES).map(([value, v]) => ({ label: v.label, value })),
  },
  { key: 'lightness', label: '明度变化幅度 %', type: 'number' as const, default: 12, min: 4, max: 30 },
]

function generate(values: Record<string, string | number | boolean>) {
  const base = hexToRgb(String(values.base ?? '#5b6cff'))
  const hsl = rgbToHsl(base)
  const scheme = SCHEMES[String(values.scheme)] ?? SCHEMES.analogous!
  const step = Number(values.lightness) || 12

  const rows: { label: string; value: string }[] = []
  scheme.offsets.forEach((offset, i) => {
    const l = Math.min(92, Math.max(12, hsl.l + (i - 2) * step * 0.6))
    const color = rgbToHex(hslToRgb({ h: hsl.h + offset, s: hsl.s, l }))
    rows.push({
      label: i === 0 ? '主色' : `色 ${i + 1}（${offset === 0 ? '同色' : `${offset > 0 ? '+' : ''}${offset}°`}）`,
      value: `${color}  ·  hsl(${((hsl.h + offset) % 360 + 360) % 360} ${hsl.s}% ${Math.round(l)}%)`,
    })
  })

  rows.push({ label: '基础 HSL', value: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)` })
  return rows
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '基于 HSL 色轮计算，生成后建议再用对比度工具验证可读性',
  resultLabel: '配色',
}

export default logic
