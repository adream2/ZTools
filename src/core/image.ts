/**
 * 图片类工具的公共小工具：加载、画布、导出、下载。
 * 放在 core 而不是 tools 下，是因为 tools 目录会被元数据校验当作工具逐个检查。
 */

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`无法解码图片：${file.name}`))
    }
    img.src = url
  })
}

export function createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')
  ctx.imageSmoothingQuality = 'high'
  return { canvas, ctx }
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime = 'image/png', quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('导出图片失败'))), mime, quality)
  })
}

export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}

/** 去掉扩展名 */
export function baseName(name: string): string {
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(0, i) : name
}

export function extOfMime(mime: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'application/zip': 'zip',
    'text/plain': 'txt',
    'application/json': 'json',
  }
  return map[mime] ?? 'bin'
}

/** 等比缩放到最长边不超过 maxEdge */
export function fitSize(width: number, height: number, maxEdge: number): { width: number; height: number } {
  if (maxEdge <= 0 || (width <= maxEdge && height <= maxEdge)) return { width, height }
  const scale = maxEdge / Math.max(width, height)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}
