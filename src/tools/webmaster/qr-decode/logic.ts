export interface QrDecodeResult {
  data: string
  version: number
  location: { topLeftCorner: { x: number; y: number } } | null
}

export async function decodeImage(file: File): Promise<QrDecodeResult> {
  if (!file.type.startsWith('image/')) throw new Error('请选择图片文件')
  if (file.size > 20 * 1024 * 1024) throw new Error('图片超过 20 MB')

  const { default: jsQR } = await import('jsqr')
  const bitmap = await createImageBitmap(file)

  // 大图降采样，jsQR 对超大分辨率既慢又不一定更准
  const maxEdge = 1600
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const imageData = ctx.getImageData(0, 0, width, height)
  const code = jsQR(imageData.data, width, height, { inversionAttempts: 'attemptBoth' })
  if (!code) throw new Error('没识别到二维码，试试更清晰、边界留白更多的图')

  return {
    data: code.data,
    version: code.version,
    location: code.location ? { topLeftCorner: code.location.topLeftCorner } : null,
  }
}
