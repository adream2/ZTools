import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'color-palette',
  title: '配色方案',
  summary: '主色生成互补、三角、类似色',
  category: 'content',
  subcategory: '颜色',
  keywords: ['配色', '色板', 'palette', '互补色', '三角色', '设计', '配色方案'],
  order: 23,
  kind: 'generator',
})
