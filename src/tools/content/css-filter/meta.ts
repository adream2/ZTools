import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'css-filter',
  title: '滤镜调试',
  summary: '多滤镜叠加，实时预览效果',
  category: 'content',
  subcategory: 'CSS',
  keywords: ['css', 'filter', '滤镜', '模糊', '灰度', '对比度', '生成器'],
  order: 17,
  kind: 'generator',
})
