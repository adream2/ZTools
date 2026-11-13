import { baseName, canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/*',
  maxSize: 20 * 1024 * 1024,
  dropHint: '选择图片',
  actionLabel: '生成圆形头像',
  fields: [
    { key: 'size', label: '输出尺寸（px）', type: 'number', default: 512, min: 64, max: 2048, step: 64 },
    { key: 'background', label: '底色', type: 'color', default: '#ffffff' },
    {
      key: 'ring',
      label: '内边距留白',
      type: 'select',
      default: 'none',
      options: [
        { label: '无', value: 'none' },
        { label: '细（4px）', value: '4' },
        { label: '中（10px）', value: '10' },
        { label: '粗（20px）', value: '20' },
      ],
    },
  ],
  run: async (files, values) => {
    const file = files[0]
    if (!file) return []

    const img = await loadImage(file)
    const size = Math.max(64, Math.min(2048, Math.round(Number(values.size)) || 512))
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    if (!side) throw new Error('图片尺寸异常')

    const offsetX = (img.naturalWidth - side) / 2
    const offsetY = (img.naturalHeight - side) / 2
    const ring = String(values.ring) === 'none' ? 0 : Number(values.ring)

    const { canvas, ctx } = createCanvas(size, size)
    ctx.fillStyle = String(values.background) || '#ffffff'
    ctx.fillRect(0, 0, size, size)

    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(img, offsetX, offsetY, side, side, 0, 0, size, size)
    ctx.restore()

    if (ring > 0) {
      ctx.save()
      ctx.strokeStyle = String(values.background) || '#ffffff'
      ctx.lineWidth = ring
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - ring / 2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    const blob = await canvasToBlob(canvas, 'image/png')
    return [
      {
        name: `${baseName(file.name)}-circle-${size}.png`,
        blob,
        meta: `${size} × ${size}${ring ? ` · 留白 ${ring}px` : ''}`,
      },
    ]
  },
  note: '居中裁正方形后裁圆，输出 PNG 保留圆角外的底色',
}

export default logic
