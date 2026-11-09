import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'css-shadow',
  title: '阴影生成器',
  summary: '可视化调参，输出 box-shadow',
  category: 'content',
  subcategory: 'CSS',
  keywords: ['css', 'box-shadow', '阴影', '生成器', '样式'],
  order: 14,
  kind: 'generator',
})
