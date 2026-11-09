export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export const RATIOS: { label: string; value: number | null }[] = [
  { label: '自由', value: null },
  { label: '1 : 1', value: 1 },
  { label: '4 : 3', value: 4 / 3 },
  { label: '16 : 9', value: 16 / 9 },
  { label: '3 : 4', value: 3 / 4 },
  { label: '9 : 16', value: 9 / 16 },
]

export function clampRect(rect: Rect, bounds: { w: number; h: number }): Rect {
  const x = Math.max(0, Math.min(rect.x, bounds.w))
  const y = Math.max(0, Math.min(rect.y, bounds.h))
  const w = Math.max(8, Math.min(rect.w, bounds.w - x))
  const h = Math.max(8, Math.min(rect.h, bounds.h - y))
  return { x, y, w, h }
}

/** 把显示坐标的选框换算成原图像素 */
export function toNaturalRect(rect: Rect, display: { w: number; h: number }, natural: { w: number; h: number }): Rect {
  const sx = natural.w / display.w
  const sy = natural.h / display.h
  return {
    x: Math.round(rect.x * sx),
    y: Math.round(rect.y * sy),
    w: Math.round(rect.w * sx),
    h: Math.round(rect.h * sy),
  }
}

export async function cropImage(file: File, naturalRect: Rect, mime = 'image/png', quality = 0.92): Promise<{ blob: Blob; url: string }> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, naturalRect.w)
  canvas.height = Math.max(1, naturalRect.h)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')
  ctx.drawImage(bitmap, naturalRect.x, naturalRect.y, naturalRect.w, naturalRect.h, 0, 0, naturalRect.w, naturalRect.h)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality))
  if (!blob) throw new Error('导出失败')
  return { blob, url: URL.createObjectURL(blob) }
}

export function applyRatio(rect: Rect, ratio: number | null, bounds: { w: number; h: number }): Rect {
  if (!ratio) return clampRect(rect, bounds)
  let w = rect.w
  let h = w / ratio
  if (h > bounds.h) {
    h = bounds.h
    w = h * ratio
  }
  if (w > bounds.w) {
    w = bounds.w
    h = w / ratio
  }
  return clampRect({ x: rect.x, y: rect.y, w, h }, bounds)
}

export function download(blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `crop-${Date.now()}.png`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
