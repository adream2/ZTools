export const SIZES = [16, 32, 48, 180, 192, 512] as const

export interface IconFile {
  size: number
  name: string
  blob: Blob
  url: string
}

export const NAMES: Record<number, string> = {
  16: 'favicon-16x16.png',
  32: 'favicon-32x32.png',
  48: 'favicon-48x48.png',
  180: 'apple-touch-icon.png',
  192: 'pwa-192x192.png',
  512: 'pwa-512x512.png',
}

async function render(bitmap: ImageBitmap, size: number): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, size, size)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('PNG 编码失败')
  return blob
}

export async function generateIcons(file: File): Promise<IconFile[]> {
  if (!file.type.startsWith('image/')) throw new Error('请选择图片文件')
  const bitmap = await createImageBitmap(file)
  const out: IconFile[] = []

  for (const size of SIZES) {
    const blob = await render(bitmap, size)
    out.push({ size, name: NAMES[size] ?? `icon-${size}.png`, blob, url: URL.createObjectURL(blob) })
  }
  bitmap.close()
  return out
}

/** 把多张 PNG 打包成 ICO（ICONDIR + 目录项 + PNG 数据） */
export async function buildIco(icons: IconFile[]): Promise<Blob> {
  const entries = await Promise.all(
    icons
      .filter((i) => i.size <= 256)
      .map(async (i) => ({ size: i.size, bytes: new Uint8Array(await i.blob.arrayBuffer()) })),
  )
  if (!entries.length) throw new Error('没有可打包的尺寸')

  const headerSize = 6 + entries.length * 16
  const total = headerSize + entries.reduce((n, e) => n + e.bytes.length, 0)
  const buffer = new ArrayBuffer(total)
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, entries.length, true)

  let offset = headerSize
  entries.forEach((entry, i) => {
    const base = 6 + i * 16
    view.setUint8(base, entry.size >= 256 ? 0 : entry.size)
    view.setUint8(base + 1, entry.size >= 256 ? 0 : entry.size)
    view.setUint8(base + 2, 0)
    view.setUint8(base + 3, 0)
    view.setUint16(base + 4, 1, true)
    view.setUint16(base + 6, 32, true)
    view.setUint32(base + 8, entry.bytes.length, true)
    view.setUint32(base + 12, offset, true)
    bytes.set(entry.bytes, offset)
    offset += entry.bytes.length
  })

  return new Blob([buffer], { type: 'image/x-icon' })
}

export function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}

export const HTML_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">`
