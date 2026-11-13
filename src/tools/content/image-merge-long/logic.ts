import { canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const MAX_PIXELS = 60_000_000

const logic: FileOpLogic = {
  accept: 'image/*',
  multiple: true,
  maxSize: 30 * 1024 * 1024,
  dropHint: '按顺序选择多张图片',
  actionLabel: '开始拼接',
  fields: [
    {
      key: 'direction',
      label: '方向',
      type: 'select',
      default: 'vertical',
      options: [
        { label: '竖向拼接（长图）', value: 'vertical' },
        { label: '横向拼接', value: 'horizontal' },
      ],
    },
    { key: 'gap', label: '间距（px）', type: 'number', default: 12, min: 0, max: 200, step: 2 },
    { key: 'color', label: '背景色', type: 'color', default: '#ffffff' },
    {
      key: 'align',
      label: '对齐',
      type: 'select',
      default: 'center',
      options: [
        { label: '居中', value: 'center' },
        { label: '左/上对齐', value: 'start' },
      ],
    },
  ],
  run: async (files, values) => {
    if (files.length < 2) throw new Error('至少选择两张图片')

    const images = []
    for (const file of files) images.push(await loadImage(file))

    const vertical = String(values.direction) !== 'horizontal'
    const gap = Math.max(0, Math.round(Number(values.gap)) || 0)
    const center = String(values.align) === 'center'

    const sizes = images.map((img) => ({ w: img.naturalWidth, h: img.naturalHeight }))
    const width = vertical
      ? Math.max(...sizes.map((s) => s.w))
      : sizes.reduce((sum, s) => sum + s.w, 0) + gap * (images.length - 1)
    const height = vertical
      ? sizes.reduce((sum, s) => sum + s.h, 0) + gap * (images.length - 1)
      : Math.max(...sizes.map((s) => s.h))

    if (width * height > MAX_PIXELS) {
      throw new Error(`拼接后约 ${width}×${height}，超过 6000 万像素，请减少图片数量`)
    }

    const { canvas, ctx } = createCanvas(width, height)
    ctx.fillStyle = String(values.color) || '#ffffff'
    ctx.fillRect(0, 0, width, height)

    let cursor = 0
    images.forEach((img, i) => {
      const s = sizes[i]!
      if (vertical) {
        const x = center ? Math.round((width - s.w) / 2) : 0
        ctx.drawImage(img, x, cursor)
        cursor += s.h + gap
      } else {
        const y = center ? Math.round((height - s.h) / 2) : 0
        ctx.drawImage(img, cursor, y)
        cursor += s.w + gap
      }
    })

    const blob = await canvasToBlob(canvas, 'image/png')
    return [
      {
        name: `merged-${images.length}pics.png`,
        blob,
        meta: `${width} × ${height} · ${images.length} 张${vertical ? '竖向' : '横向'}拼接`,
      },
    ]
  },
  note: '按选择顺序拼接；总像素超过 6000 万会拒绝，避免浏览器崩溃',
}

export default logic
