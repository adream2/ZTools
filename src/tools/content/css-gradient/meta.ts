import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'css-gradient',
  title: '渐变生成器',
  summary: '线性 / 径向渐变，多色标',
  category: 'content',
  subcategory: 'CSS',
  keywords: ['css', 'gradient', '渐变', '背景', '生成器', 'linear'],
  order: 15,
  kind: 'generator',
})
