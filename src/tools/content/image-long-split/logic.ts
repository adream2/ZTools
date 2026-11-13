import { baseName, canvasToBlob, createCanvas, extOfMime, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/*',
  maxSize: 30 * 1024 * 1024,
  dropHint: '选择长图',
  actionLabel: '开始切分',
  fields: [
    { key: 'slice', label: '每张高度（px）', type: 'number', default: 900, min: 100, max: 4000, step: 50 },
    { key: 'overlap', label: '重叠（px）', type: 'number', default: 0, min: 0, max: 200, step: 10, hint: '防止切断文字行' },
    {
      key: 'format',
      label: '格式',
      type: 'select',
      default: 'image/jpeg',
      options: [
        { label: 'JPEG', value: 'image/jpeg' },
        { label: 'PNG', value: 'image/png' },
      ],
    },
  ],
  run: async (files, values) => {
    const file = files[0]
    if (!file) return []

    const img = await loadImage(file)
    const width = img.naturalWidth
    const height = img.naturalHeight
    const slice = Math.max(100, Math.min(4000, Math.round(Number(values.slice)) || 900))
    const overlap = Math.max(0, Math.min(slice - 1, Math.round(Number(values.overlap)) || 0))
    const mime = String(values.format) || 'image/jpeg'

    if (height <= slice) throw new Error(`图片只有 ${height}px 高，不需要切分`)

    const outputs = []
    let index = 1
    for (let top = 0; top < height; top += slice - overlap) {
      const h = Math.min(slice, height - top)
      if (h < 20) break

      const { canvas, ctx } = createCanvas(width, h)
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, h)
      }
      ctx.drawImage(img, 0, top, width, h, 0, 0, width, h)
      const blob = await canvasToBlob(canvas, mime, 0.92)

      outputs.push({
        name: `${baseName(file.name)}-${String(index).padStart(2, '0')}.${extOfMime(mime)}`,
        blob,
        meta: `第 ${index} 张 · 顶部 ${top}px · ${width} × ${h}`,
      })
      index += 1
      if (index > 80) throw new Error('切分张数超过 80，请增大每张高度')
    }

    return outputs
  },
  note: '按从上到下的顺序命名，上传时保持顺序即可',
}

export default logic
