import { baseName, canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/svg+xml,.svg',
  maxSize: 10 * 1024 * 1024,
  dropHint: '选择 SVG 文件',
  actionLabel: '导出 PNG',
  fields: [
    { key: 'width', label: '输出宽度（px）', type: 'number', default: 1024, min: 16, max: 8192, step: 16 },
    {
      key: 'background',
      label: '背景',
      type: 'select',
      default: 'transparent',
      options: [
        { label: '透明', value: 'transparent' },
        { label: '白色', value: 'white' },
        { label: '深色', value: 'dark' },
      ],
    },
  ],
  run: async (files, values) => {
    const file = files[0]
    if (!file) return []

    const img = await loadImage(file)
    const naturalW = img.naturalWidth || 300
    const naturalH = img.naturalHeight || 150
    const width = Math.max(16, Math.min(8192, Math.round(Number(values.width)) || 1024))
    const height = Math.max(1, Math.round((width * naturalH) / naturalW))

    const { canvas, ctx } = createCanvas(width, height)
    const bg = String(values.background)
    if (bg === 'white') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
    } else if (bg === 'dark') {
      ctx.fillStyle = '#111318'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, 'image/png')
    return [
      {
        name: `${baseName(file.name)}-${width}px.png`,
        blob,
        meta: `${width} × ${height} · ${bg === 'transparent' ? '透明背景' : bg === 'white' ? '白底' : '深色底'}`,
      },
    ]
  },
  note: '按 SVG 自身比例等比缩放；无尺寸信息的 SVG 按 300×150 估算',
}

export default logic
