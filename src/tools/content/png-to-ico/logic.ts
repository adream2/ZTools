import { baseName, canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/png,image/jpeg,image/webp',
  maxSize: 10 * 1024 * 1024,
  dropHint: '选择正方形图片',
  actionLabel: '生成 ICO',
  fields: [
    {
      key: 'sizes',
      label: '包含尺寸',
      type: 'select',
      default: 'all',
      options: [
        { label: '16 / 32 / 48 / 256（推荐）', value: 'all' },
        { label: '仅 32', value: '32' },
        { label: '仅 48', value: '48' },
        { label: '仅 256', value: '256' },
      ],
    },
  ],
  run: async (files, values) => {
    const file = files[0]
    if (!file) return []

    const img = await loadImage(file)
    const choice = String(values.sizes)
    const sizes = choice === 'all' ? [16, 32, 48, 256] : [Number(choice)]

    const frames: Array<{ size: number; data: ArrayBuffer }> = []
    for (const size of sizes) {
      const { canvas, ctx } = createCanvas(size, size)
      const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight)
      const w = Math.max(1, Math.round(img.naturalWidth * scale))
      const h = Math.max(1, Math.round(img.naturalHeight * scale))
      ctx.drawImage(img, Math.round((size - w) / 2), Math.round((size - h) / 2), w, h)
      const blob = await canvasToBlob(canvas, 'image/png')
      frames.push({ size, data: await blob.arrayBuffer() })
    }

    const headerSize = 6 + frames.length * 16
    const total = headerSize + frames.reduce((sum, f) => sum + f.data.byteLength, 0)
    const buffer = new ArrayBuffer(total)
    const view = new DataView(buffer)
    const bytes = new Uint8Array(buffer)

    view.setUint16(0, 0, true) // reserved
    view.setUint16(2, 1, true) // type = icon
    view.setUint16(4, frames.length, true)

    let dataOffset = headerSize
    frames.forEach((frame, i) => {
      const base = 6 + i * 16
      view.setUint8(base, frame.size >= 256 ? 0 : frame.size)
      view.setUint8(base + 1, frame.size >= 256 ? 0 : frame.size)
      view.setUint8(base + 2, 0)
      view.setUint8(base + 3, 0)
      view.setUint16(base + 4, 1, true) // planes
      view.setUint16(base + 6, 32, true) // bpp
      view.setUint32(base + 8, frame.data.byteLength, true)
      view.setUint32(base + 12, dataOffset, true)
      bytes.set(new Uint8Array(frame.data), dataOffset)
      dataOffset += frame.data.byteLength
    })

    const blob = new Blob([buffer], { type: 'image/x-icon' })
    return [
      {
        name: `${baseName(file.name)}.ico`,
        blob,
        meta: `${frames.map((f) => f.size).join(' / ')} · ${(blob.size / 1024).toFixed(1)} KB`,
      },
    ]
  },
  note: 'ICO 内嵌 PNG 数据，Windows Vista 及以上与所有现代浏览器都支持',
}

export default logic
