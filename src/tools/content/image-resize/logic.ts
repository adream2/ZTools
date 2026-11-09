export type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp'

export interface ResizeOptions {
  maxEdge: number
  format: OutputFormat
  quality: number
  square: boolean
}

export interface ResizedItem {
  name: string
  originalSize: number
  blob: Blob
  url: string
  width: number
  height: number
}

export function fit(width: number, height: number, maxEdge: number, square: boolean): { w: number; h: number } {
  if (square) {
    const side = Math.min(maxEdge || Math.min(width, height), Math.max(width, height))
    return { w: side, h: side }
  }
  if (!maxEdge || Math.max(width, height) <= maxEdge) return { w: width, h: height }
  const scale = maxEdge / Math.max(width, height)
  return { w: Math.max(1, Math.round(width * scale)), h: Math.max(1, Math.round(height * scale)) }
}

export async function resizeOne(file: File, options: ResizeOptions): Promise<ResizedItem> {
  const bitmap = await createImageBitmap(file)
  const size = fit(bitmap.width, bitmap.height, options.maxEdge, options.square)

  const canvas = document.createElement('canvas')
  canvas.width = size.w
  canvas.height = size.h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')

  if (options.format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size.w, size.h)
  }

  if (options.square) {
    // 居中裁剪成正方形
    const side = Math.min(bitmap.width, bitmap.height)
    const sx = (bitmap.width - side) / 2
    const sy = (bitmap.height - side) / 2
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size.w, size.h)
  } else {
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, size.w, size.h)
  }
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, options.format, options.format === 'image/png' ? undefined : options.quality),
  )
  if (!blob) throw new Error('编码失败')

  return {
    name: file.name,
    originalSize: file.size,
    blob,
    url: URL.createObjectURL(blob),
    width: size.w,
    height: size.h,
  }
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function download(blob: Blob, name: string, format: OutputFormat): void {
  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'
  const base = name.replace(/\.[^.]+$/, '')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${base}-${Date.now()}.${ext}`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}
