import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-resize',
  title: '批量改尺寸',
  summary: '多张图片统一缩放，保持比例',
  category: 'content',
  subcategory: '图片',
  keywords: ['批量', '改尺寸', '缩放', 'resize', '多图', '压缩尺寸'],
  order: 26,
})
