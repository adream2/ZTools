import { baseName, canvasToBlob, createCanvas, extOfMime, fitSize, loadImage } from '@/core/image'
import { formatBytes } from '@/tools/dev/hash/logic'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/*',
  multiple: true,
  maxSize: 30 * 1024 * 1024,
  dropHint: '选择多张图片',
  actionLabel: '批量压缩',
  fields: [
    { key: 'maxEdge', label: '最长边（px）', type: 'number', default: 1600, min: 200, max: 6000, step: 100 },
    { key: 'quality', label: '质量（1–100）', type: 'number', default: 82, min: 40, max: 100, step: 2 },
    {
      key: 'format',
      label: '输出格式',
      type: 'select',
      default: 'image/webp',
      options: [
        { label: 'WebP（最小）', value: 'image/webp' },
        { label: 'JPEG（兼容）', value: 'image/jpeg' },
        { label: 'PNG（无损）', value: 'image/png' },
      ],
    },
  ],
  run: async (files, values) => {
    const maxEdge = Math.max(200, Math.min(6000, Math.round(Number(values.maxEdge)) || 1600))
    const quality = Math.max(0.4, Math.min(1, (Number(values.quality) || 82) / 100))
    const mime = String(values.format) || 'image/webp'
    const outputs = []

    for (const file of files) {
      const img = await loadImage(file)
      const size = fitSize(img.naturalWidth, img.naturalHeight, maxEdge)
      const { canvas, ctx } = createCanvas(size.width, size.height)
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, size.width, size.height)
      }
      ctx.drawImage(img, 0, 0, size.width, size.height)
      const blob = await canvasToBlob(canvas, mime, quality)

      const ratio = file.size ? Math.round((1 - blob.size / file.size) * 100) : 0
      outputs.push({
        name: `${baseName(file.name)}-min.${extOfMime(mime)}`,
        blob,
        meta: `${size.width} × ${size.height} · ${formatBytes(file.size)} → ${formatBytes(blob.size)}${ratio > 0 ? `（-${ratio}%）` : ''}`,
      })
    }

    return outputs
  },
  note: '全部在本地完成，图片不会上传；已小于目标尺寸的图不会被放大',
}

export default logic
