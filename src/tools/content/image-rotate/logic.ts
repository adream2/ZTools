export interface RotateState {
  angle: number
  flipH: boolean
  flipV: boolean
}

export const DEFAULT_STATE: RotateState = { angle: 0, flipH: false, flipV: false }

function canvasSize(width: number, height: number, angle: number): { w: number; h: number } {
  const normalized = ((angle % 360) + 360) % 360
  return normalized === 90 || normalized === 270 ? { w: height, h: width } : { w: width, h: height }
}

export async function transformImage(
  file: File,
  state: RotateState,
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality = 0.92,
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  const angle = ((state.angle % 360) + 360) % 360
  const size = canvasSize(bitmap.width, bitmap.height, angle)

  const canvas = document.createElement('canvas')
  canvas.width = size.w
  canvas.height = size.h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size.w, size.h)
  }

  ctx.translate(size.w / 2, size.h / 2)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1)
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality))
  if (!blob) throw new Error('导出失败')
  return { blob, url: URL.createObjectURL(blob), width: size.w, height: size.h }
}

export function download(blob: Blob, name: string, format: string): void {
  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'
  const base = name.replace(/\.[^.]+$/, '')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${base}-rotated.${ext}`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}
