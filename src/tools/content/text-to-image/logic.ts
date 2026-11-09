export interface CardOptions {
  title: string
  body: string
  footer: string
  width: number
  height: number
  theme: string
  fontSize: number
  align: 'left' | 'center'
}

export const THEMES: Record<string, { label: string; from: string; to: string; text: string; sub: string }> = {
  midnight: { label: '深蓝', from: '#1b2a5e', to: '#0d1430', text: '#ffffff', sub: '#b9c6ff' },
  mint: { label: '薄荷', from: '#3fc9a4', to: '#1a8f78', text: '#ffffff', sub: '#dcfff4' },
  sunset: { label: '日落', from: '#ff8f7d', to: '#b7452f', text: '#ffffff', sub: '#ffe3dc' },
  paper: { label: '纸白', from: '#f8faff', to: '#e5eaf6', text: '#2b2e42', sub: '#666b8a' },
  ink: { label: '墨黑', from: '#2b2e42', to: '#14161f', text: '#ffffff', sub: '#a0a5bd' },
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split(/\r?\n/)) {
    if (!paragraph) {
      lines.push('')
      continue
    }
    let current = ''
    for (const ch of [...paragraph]) {
      const test = current + ch
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current)
        current = ch
      } else {
        current = test
      }
    }
    if (current) lines.push(current)
  }
  return lines
}

export async function renderCard(options: CardOptions): Promise<{ blob: Blob; url: string }> {
  const theme = THEMES[options.theme] ?? THEMES.midnight!
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')

  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, options.width, options.height)
  gradient.addColorStop(0, theme.from)
  gradient.addColorStop(1, theme.to)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, options.width, options.height)

  // 柔和光斑
  const glow = ctx.createRadialGradient(options.width * 0.82, options.height * 0.12, 10, options.width * 0.82, options.height * 0.12, options.width * 0.62)
  glow.addColorStop(0, 'rgba(255,255,255,0.22)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, options.width, options.height)

  const padding = Math.round(options.width * 0.075)
  const maxWidth = options.width - padding * 2

  ctx.textAlign = options.align === 'center' ? 'center' : 'left'
  const x = options.align === 'center' ? options.width / 2 : padding

  // 标题
  const titleSize = Math.round(options.fontSize * 1.6)
  ctx.fillStyle = theme.text
  ctx.font = `600 ${titleSize}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
  const titleLines = wrapText(ctx, options.title, maxWidth).slice(0, 4)
  // 标题区垂直居中
  const bodySize = options.fontSize
  ctx.font = `400 ${bodySize}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
  const bodyLines = wrapText(ctx, options.body, maxWidth)
  const lineHeightTitle = titleSize * 1.28
  const lineHeightBody = bodySize * 1.62

  const totalHeight = titleLines.length * lineHeightTitle + (bodyLines.length ? 22 + bodyLines.length * lineHeightBody : 0)
  let y = Math.max(padding + titleSize, (options.height - totalHeight) / 2)

  ctx.font = `600 ${titleSize}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.fillStyle = theme.text
  for (const line of titleLines) {
    y += lineHeightTitle
    ctx.fillText(line, x, y - lineHeightTitle * 0.28)
  }

  if (bodyLines.length) {
    y += 22
    ctx.font = `400 ${bodySize}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
    ctx.fillStyle = theme.sub
    for (const line of bodyLines) {
      y += lineHeightBody
      ctx.fillText(line, x, y - lineHeightBody * 0.28)
    }
  }

  // 页脚
  if (options.footer) {
    ctx.font = `500 ${Math.round(bodySize * 0.78)}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
    ctx.fillStyle = theme.sub
    ctx.textAlign = 'left'
    ctx.fillText(options.footer, padding, options.height - padding)
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('导出失败')
  return { blob, url: URL.createObjectURL(blob) }
}

export function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}
