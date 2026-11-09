export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile'

export interface WatermarkOptions {
  text: string
  position: Position
  opacity: number
  size: number
  color: string
  rotate: boolean
}

export const DEFAULT_OPTIONS: WatermarkOptions = {
  text: 'ZT 工具箱',
  position: 'bottom-right',
  opacity: 35,
  size: 3.2,
  color: '#ffffff',
  rotate: false,
}

export const POSITIONS: { id: Position; label: string }[] = [
  { id: 'top-left', label: '左上' },
  { id: 'top-right', label: '右上' },
  { id: 'bottom-left', label: '左下' },
  { id: 'bottom-right', label: '右下' },
  { id: 'center', label: '居中' },
  { id: 'tile', label: '平铺' },
]

export async function applyWatermark(
  file: File,
  options: WatermarkOptions,
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality = 0.92,
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  if (!options.text.trim()) throw new Error('水印文字不能为空')

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const fontSize = Math.max(10, Math.round((Math.min(canvas.width, canvas.height) * options.size) / 100))
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.fillStyle = options.color
  ctx.globalAlpha = Math.min(1, Math.max(0.05, options.opacity / 100))
  ctx.textBaseline = 'middle'

  const metrics = ctx.measureText(options.text)
  const textW = metrics.width
  const textH = fontSize * 1.3
  const pad = Math.round(fontSize * 0.9)

  const positions: Record<Exclude<Position, 'tile'>, [number, number, CanvasTextAlign]> = {
    'top-left': [pad, pad + textH / 2, 'left'],
    'top-right': [canvas.width - pad, pad + textH / 2, 'right'],
    'bottom-left': [pad, canvas.height - pad - textH / 2, 'left'],
    'bottom-right': [canvas.width - pad, canvas.height - pad - textH / 2, 'right'],
    center: [canvas.width / 2, canvas.height / 2, 'center'],
  }

  if (options.position === 'tile') {
    const stepX = textW + pad * 2
    const stepY = textH + pad * 1.4
    ctx.textAlign = 'left'
    for (let y = pad; y < canvas.height + stepY; y += stepY) {
      for (let x = -stepX; x < canvas.width + stepX; x += stepX) {
        ctx.save()
        if (options.rotate) {
          ctx.translate(x + textW / 2, y)
          ctx.rotate(-Math.PI / 9)
          ctx.fillText(options.text, -textW / 2, 0)
        } else {
          ctx.fillText(options.text, x, y)
        }
        ctx.restore()
      }
    }
  } else {
    const [x, y, align] = positions[options.position as Exclude<Position, 'tile'>]
    ctx.textAlign = align
    if (options.rotate) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(-Math.PI / 9)
      ctx.fillText(options.text, 0, 0)
      ctx.restore()
    } else {
      ctx.fillText(options.text, x, y)
    }
  }

  ctx.globalAlpha = 1
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality))
  if (!blob) throw new Error('导出失败')
  return { blob, url: URL.createObjectURL(blob), width: canvas.width, height: canvas.height }
}

export function download(blob: Blob, name: string, format: string): void {
  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'
  const base = name.replace(/\.[^.]+$/, '')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${base}-watermark.${ext}`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}
