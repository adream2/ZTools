import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-rotate',
  title: '图片旋转',
  summary: '90° 旋转与水平垂直翻转',
  category: 'content',
  subcategory: '图片',
  keywords: ['图片', '旋转', '翻转', '镜像', 'rotate', 'flip', '方向'],
  order: 25,
})
