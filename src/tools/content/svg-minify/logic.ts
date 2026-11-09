import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'minify', label: '压缩', group: '处理' },
  { id: 'stripMeta', label: '去掉编辑器元数据', group: '处理' },
  { id: 'dataUri', label: '转 CSS 背景图', group: '输出' },
]

const JUNK_ATTRS = [
  'xmlns:xlink',
  'xml:space',
  'enable-background',
  'data-name',
  'inkscape:version',
  'inkscape:label',
  'inkscape:groupmode',
  'sodipodi:role',
  'sodipodi:nodetypes',
]

export function minifySvg(svg: string): string {
  let out = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim()

  for (const attr of JUNK_ATTRS) {
    out = out.replace(new RegExp(`\\s${attr}="[^"]*"`, 'g'), '')
  }

  // 数字去掉多余小数与单位
  out = out.replace(/(\d)\.0+(?=[\s"')])/g, '$1')
  out = out.replace(/(\d+\.\d{3})\d+/g, '$1')

  return out
}

function toDataUri(svg: string): string {
  const encoded = minifySvg(svg)
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
  return `background-image: url("data:image/svg+xml,${encoded}");`
}

function apply(text: string, op: string): string {
  if (op === 'stripMeta') {
    return text
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
      .replace(/<sodipodi:namedview[\s\S]*?\/>/gi, '')
      .replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/gi, '')
      .replace(/<[a-z]+:[^>]*\/>/gi, '')
  }
  if (op === 'dataUri') return toDataUri(text)
  return minifySvg(text)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample:
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">\n  <!-- 图标 -->\n  <rect width="64.0" height="64.0" rx="14" fill="#5b6cff" />\n</svg>',
  note: '只做安全的文本级压缩，不改变图形结构',
  inputLabel: 'SVG 源码',
  outputLabel: '结果',
  noChain: true,
}

export default logic
