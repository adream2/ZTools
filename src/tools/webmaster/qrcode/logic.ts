import { encode, renderSVG } from 'uqr'

export type Ecc = 'L' | 'M' | 'Q' | 'H'

export interface QrOptions {
  ecc: Ecc
  size: number
  margin: number
  dark: string
  light: string
  transparent: boolean
}

export const DEFAULT_OPTIONS: QrOptions = {
  ecc: 'M',
  size: 320,
  margin: 2,
  dark: '#17181c',
  light: '#ffffff',
  transparent: false,
}

export function makeSvg(text: string, options: QrOptions): string {
  const value = text.trim()
  if (!value) return ''
  // uqr 在内容超出容量时抛错，交给调用方展示
  const qr = encode(value, { ecc: options.ecc, border: options.margin })
  return renderSVG(value, {
    ecc: options.ecc,
    pixelSize: Math.max(2, Math.round(options.size / (qr.size + options.margin * 2))),
    blackColor: options.dark,
    whiteColor: options.transparent ? '#00000000' : options.light,
    border: options.margin,
  })
}

export async function svgToPng(svg: string, size: number): Promise<Blob> {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    img.decoding = 'sync'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('SVG 渲染失败'))
      img.src = url
    })

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('当前浏览器不支持 Canvas')
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0, size, size)

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

export function capacityHint(ecc: Ecc): string {
  return { L: '约 2953 字节', M: '约 2331 字节', Q: '约 1663 字节', H: '约 1273 字节' }[ecc]
}
