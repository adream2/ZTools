export interface SvgInfo {
  svg: string
  width: number
  height: number
  viewBox: string
  warnings: string[]
  size: number
}

const DANGEROUS_TAGS = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'audio', 'video']

export function sanitizeSvg(raw: string): SvgInfo {
  const text = raw.trim()
  if (!text) throw new Error('请粘贴 SVG 代码')

  const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) throw new Error('XML 解析失败，请检查标签是否闭合')

  const root = doc.documentElement
  if (root.tagName.toLowerCase() !== 'svg') throw new Error('根节点必须是 <svg>')

  const warnings: string[] = []

  for (const tag of DANGEROUS_TAGS) {
    const nodes = Array.from(doc.getElementsByTagName(tag))
    if (nodes.length) {
      warnings.push(`移除了 ${nodes.length} 个 <${tag}>`)
      for (const n of nodes) n.remove()
    }
  }

  const all = Array.from(doc.querySelectorAll('*'))
  for (const el of all) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
        continue
      }
      if ((name === 'href' || name === 'xlink:href') && /^\s*(javascript|data:text\/html)/i.test(attr.value)) {
        el.removeAttribute(attr.name)
        warnings.push('移除了可疑链接')
      }
    }
  }

  const viewBox = root.getAttribute('viewBox') ?? ''
  const rawWidth = root.getAttribute('width') ?? ''
  const rawHeight = root.getAttribute('height') ?? ''

  let width = parseFloat(rawWidth) || 0
  let height = parseFloat(rawHeight) || 0

  if ((!width || !height) && viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(Number)
    width = width || parts[2] || 0
    height = height || parts[3] || 0
  }

  if (!width || !height) {
    width = 300
    height = 150
    warnings.push('未声明尺寸，按 300×150 显示')
  }

  root.setAttribute('width', String(width))
  root.setAttribute('height', String(height))
  if (!root.getAttribute('xmlns')) root.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const svg = new XMLSerializer().serializeToString(root)

  return {
    svg,
    width: Math.round(width),
    height: Math.round(height),
    viewBox,
    warnings: [...new Set(warnings)],
    size: new Blob([svg]).size,
  }
}

export function optimizeSvg(svg: string): string {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export async function svgToPng(svg: string, width: number, scale = 2): Promise<Blob> {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('SVG 渲染失败'))
      img.src = url
    })

    const w = Math.max(1, Math.round(width * scale))
    const h = Math.max(1, Math.round((img.height / img.width) * w))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('当前浏览器不支持 Canvas')
    ctx.drawImage(img, 0, 0, w, h)

    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!out) throw new Error('PNG 导出失败')
    return out
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128">
  <rect width="64" height="64" rx="14" fill="#2f6bff" />
  <g fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 16 50 40" />
    <path d="M14 32 32 50" />
    <path d="M38 16h12v12" />
    <path d="M26 54H14V42" />
  </g>
</svg>`
