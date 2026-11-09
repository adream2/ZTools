import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-format',
  title: '图片格式转换',
  summary: 'PNG / JPEG / WebP 互转',
  category: 'content',
  subcategory: '图片',
  keywords: ['图片', '格式转换', 'png', 'jpg', 'webp', 'convert', '转格式'],
  order: 27,
})
