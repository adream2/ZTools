export type OutputFormat = 'image/webp' | 'image/jpeg' | 'image/png'

export interface CompressOptions {
  format: OutputFormat
  quality: number
  maxEdge: number
}

export interface CompressResult {
  blob: Blob
  url: string
  width: number
  height: number
  originalSize: number
  outputSize: number
  ratio: number
}

export const MAX_FILE = 30 * 1024 * 1024

export const FORMAT_LABEL: Record<OutputFormat, string> = {
  'image/webp': 'WebP',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
}

export function supportsWebp(): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').startsWith('data:image/webp')
}

export function fitSize(width: number, height: number, maxEdge: number): { width: number; height: number } {
  if (maxEdge <= 0 || Math.max(width, height) <= maxEdge) return { width, height }
  const scale = maxEdge / Math.max(width, height)
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

export async function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  if (file.size > MAX_FILE) throw new Error('图片超过 30 MB，请先本地裁剪')
  if (!file.type.startsWith('image/')) throw new Error('不是图片文件')

  const bitmap = await createImageBitmap(file)
  const target = fitSize(bitmap.width, bitmap.height, options.maxEdge)

  const canvas = document.createElement('canvas')
  canvas.width = target.width
  canvas.height = target.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')

  // JPEG 不支持透明，先铺白底避免透明区域变黑
  if (options.format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, target.width, target.height)
  }
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, target.width, target.height)
  bitmap.close()

  const quality = options.format === 'image/png' ? undefined : options.quality
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, options.format, quality))
  if (!blob) throw new Error('编码失败，可能是浏览器不支持该格式')

  return {
    blob,
    url: URL.createObjectURL(blob),
    width: target.width,
    height: target.height,
    originalSize: file.size,
    outputSize: blob.size,
    ratio: file.size ? Math.round((1 - blob.size / file.size) * 100) : 0,
  }
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function download(blob: Blob, originalName: string, format: OutputFormat): void {
  const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png'
  const base = originalName.replace(/\.[^.]+$/, '')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${base}-compressed.${ext}`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
