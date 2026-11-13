import { baseName, canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/*',
  maxSize: 20 * 1024 * 1024,
  dropHint: '选择图片',
  actionLabel: '加相框',
  fields: [
    { key: 'border', label: '四周边框（px）', type: 'number', default: 40, min: 0, max: 400, step: 4 },
    { key: 'bottom', label: '底部额外留白（px）', type: 'number', default: 80, min: 0, max: 600, step: 10 },
    { key: 'color', label: '边框颜色', type: 'color', default: '#ffffff' },
  ],
  run: async (files, values) => {
    const file = files[0]
    if (!file) return []

    const img = await loadImage(file)
    const border = Math.max(0, Math.round(Number(values.border)) || 0)
    const bottom = Math.max(0, Math.round(Number(values.bottom)) || 0)
    const width = img.naturalWidth + border * 2
    const height = img.naturalHeight + border * 2 + bottom

    const { canvas, ctx } = createCanvas(width, height)
    ctx.fillStyle = String(values.color) || '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, border, border)

    const blob = await canvasToBlob(canvas, 'image/png')
    return [
      {
        name: `${baseName(file.name)}-frame.png`,
        blob,
        meta: `${width} × ${height} · 边框 ${border}px${bottom ? ` · 底部 +${bottom}px` : ''}`,
      },
    ]
  },
  note: '边框与底部留白都按像素计算，不随图片尺寸缩放',
}

export default logic
