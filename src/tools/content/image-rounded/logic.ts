import { baseName, canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/*',
  maxSize: 20 * 1024 * 1024,
  dropHint: '选择图片',
  actionLabel: '生成圆角图',
  fields: [
    { key: 'radius', label: '圆角半径（px）', type: 'number', default: 48, min: 0, max: 512, step: 4 },
    {
      key: 'pad',
      label: '四周留白（px）',
      type: 'number',
      default: 0,
      min: 0,
      max: 200,
      step: 4,
      hint: '留白可做出卡片效果',
    },
    { key: 'background', label: '底色', type: 'color', default: '#ffffff' },
  ],
  run: async (files, values) => {
    const file = files[0]
    if (!file) return []

    const img = await loadImage(file)
    const pad = Math.max(0, Math.round(Number(values.pad)) || 0)
    const width = img.naturalWidth + pad * 2
    const height = img.naturalHeight + pad * 2
    const radius = Math.max(0, Math.min(Math.round(Number(values.radius)) || 0, Math.min(width, height) / 2))

    const { canvas, ctx } = createCanvas(width, height)
    if (pad > 0) {
      ctx.fillStyle = String(values.background) || '#ffffff'
      ctx.fillRect(0, 0, width, height)
    }

    if (radius > 0) {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(pad + radius, pad)
      ctx.lineTo(width - pad - radius, pad)
      ctx.quadraticCurveTo(width - pad, pad, width - pad, pad + radius)
      ctx.lineTo(width - pad, height - pad - radius)
      ctx.quadraticCurveTo(width - pad, height - pad, width - pad - radius, height - pad)
      ctx.lineTo(pad + radius, height - pad)
      ctx.quadraticCurveTo(pad, height - pad, pad, height - pad - radius)
      ctx.lineTo(pad, pad + radius)
      ctx.quadraticCurveTo(pad, pad, pad + radius, pad)
      ctx.closePath()
      ctx.clip()
    }

    ctx.drawImage(img, pad, pad)
    if (radius > 0) ctx.restore()

    const blob = await canvasToBlob(canvas, 'image/png')
    return [
      {
        name: `${baseName(file.name)}-rounded.png`,
        blob,
        meta: `${width} × ${height}${radius ? ` · 圆角 ${radius}px` : ''}${pad ? ` · 留白 ${pad}px` : ''}`,
      },
    ]
  },
  note: '输出 PNG，圆角与留白区域可控',
}

export default logic
