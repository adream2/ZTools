import { baseName, canvasToBlob, createCanvas, loadImage } from '@/core/image'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: 'image/*',
  multiple: true,
  maxSize: 30 * 1024 * 1024,
  dropHint: '选择一张或多张图片',
  actionLabel: '批量加水印',
  fields: [
    { key: 'text', label: '水印文字', type: 'text', default: '© ZT 工具箱' },
    {
      key: 'position',
      label: '位置',
      type: 'select',
      default: 'br',
      options: [
        { label: '右下角', value: 'br' },
        { label: '居中', value: 'center' },
        { label: '平铺', value: 'tile' },
      ],
    },
    { key: 'size', label: '字号（px）', type: 'number', default: 36, min: 8, max: 400, step: 2 },
    { key: 'opacity', label: '不透明度（%）', type: 'number', default: 55, min: 5, max: 100, step: 5 },
    { key: 'color', label: '颜色', type: 'color', default: '#ffffff' },
    { key: 'margin', label: '边距（px）', type: 'number', default: 24, min: 0, max: 300, step: 4 },
  ],
  run: async (files, values) => {
    const text = String(values.text ?? '').trim()
    if (!text) throw new Error('水印文字不能为空')

    const size = Math.max(8, Math.round(Number(values.size)) || 36)
    const alpha = Math.max(0.05, Math.min(1, (Number(values.opacity) || 55) / 100))
    const margin = Math.max(0, Math.round(Number(values.margin)) || 0)
    const color = String(values.color) || '#ffffff'
    const position = String(values.position)

    const outputs = []
    for (const file of files) {
      const img = await loadImage(file)
      const { canvas, ctx } = createCanvas(img.naturalWidth, img.naturalHeight)
      ctx.drawImage(img, 0, 0)

      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.font = `600 ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`
      ctx.textBaseline = 'alphabetic'
      const textWidth = ctx.measureText(text).width

      if (position === 'center') {
        ctx.textAlign = 'center'
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 + size / 3)
      } else if (position === 'tile') {
        ctx.textAlign = 'left'
        const stepX = Math.max(160, textWidth + 120)
        const stepY = Math.max(120, size * 3)
        for (let y = stepY; y < canvas.height; y += stepY) {
          for (let x = stepX / 2; x < canvas.width; x += stepX) {
            ctx.fillText(text, x, y)
          }
        }
      } else {
        ctx.textAlign = 'right'
        ctx.fillText(text, canvas.width - margin, canvas.height - margin)
      }
      ctx.globalAlpha = 1

      const blob = await canvasToBlob(canvas, 'image/png')
      outputs.push({
        name: `${baseName(file.name)}-wm.png`,
        blob,
        meta: `${canvas.width} × ${canvas.height} · ${position === 'br' ? '右下角' : position === 'center' ? '居中' : '平铺'}`,
      })
    }

    return outputs
  },
  note: '水印直接画在像素上，无法通过删除图层去掉',
}

export default logic
