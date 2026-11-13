export const FORMATS = [
  { id: 'CODE128', label: 'Code 128（通用）', hint: '支持任意 ASCII 字符' },
  { id: 'CODE39', label: 'Code 39', hint: '大写字母、数字与少量符号' },
  { id: 'EAN13', label: 'EAN-13（商品条码）', hint: '需 12 位数字，自动补校验位' },
  { id: 'EAN8', label: 'EAN-8', hint: '需 7 位数字' },
  { id: 'UPC', label: 'UPC-A', hint: '需 11 位数字' },
  { id: 'ITF14', label: 'ITF-14（物流箱码）', hint: '需 13 位数字' },
  { id: 'MSI', label: 'MSI', hint: '仅数字' },
  { id: 'Pharmacode', label: 'Pharmacode', hint: '3–131070 的数字' },
] as const

export type BarcodeFormat = (typeof FORMATS)[number]['id']

export interface BarcodeOptions {
  format: BarcodeFormat
  width: number
  height: number
  showText: boolean
  fontSize: number
  margin: number
}

export const DEFAULT_OPTIONS: BarcodeOptions = {
  format: 'CODE128',
  width: 2,
  height: 90,
  showText: true,
  fontSize: 18,
  margin: 10,
}

export function validate(text: string, format: BarcodeFormat): string {
  const value = text.trim()
  if (!value) throw new Error('请输入内容')
  if (format === 'EAN13' && !/^\d{12,13}$/.test(value)) throw new Error('EAN-13 需要 12 或 13 位数字')
  if (format === 'EAN8' && !/^\d{7,8}$/.test(value)) throw new Error('EAN-8 需要 7 或 8 位数字')
  if (format === 'UPC' && !/^\d{11,12}$/.test(value)) throw new Error('UPC-A 需要 11 或 12 位数字')
  if (format === 'ITF14' && !/^\d{13,14}$/.test(value)) throw new Error('ITF-14 需要 13 或 14 位数字')
  if (format === 'MSI' && !/^\d+$/.test(value)) throw new Error('MSI 只支持数字')
  if (format === 'Pharmacode') {
    const n = Number(value)
    if (!Number.isInteger(n) || n < 3 || n > 131070) throw new Error('Pharmacode 需要 3–131070 的整数')
  }
  if (format === 'CODE39' && !/^[0-9A-Z\-. $/+%]+$/.test(value.toUpperCase())) {
    throw new Error('Code 39 只支持大写字母、数字与 - . $ / + % 空格')
  }
  return value
}

export async function svgToPng(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const rect = svg.getBoundingClientRect()
  const width = Math.max(1, Math.round((rect.width || 320) * scale))
  const height = Math.max(1, Math.round((rect.height || 120) * scale))

  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('width', String(rect.width || 320))
  clone.setAttribute('height', String(rect.height || 120))
  const data = new XMLSerializer().serializeToString(clone)
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`

  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('SVG 渲染失败'))
    img.src = url
  })

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('当前浏览器不支持 Canvas')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('PNG 导出失败')
  return blob
}

export function download(blob: Blob | string, name: string, _type: string): void {
  const url = typeof blob === 'string' ? blob : URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  if (typeof blob !== 'string') setTimeout(() => URL.revokeObjectURL(url), 1200)
}
