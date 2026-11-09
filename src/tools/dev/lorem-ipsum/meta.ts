import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'lorem-ipsum',
  title: '占位文本',
  summary: '中英文 Lorem Ipsum 批量生成',
  category: 'dev',
  subcategory: '生成',
  keywords: ['lorem', 'ipsum', '占位', '假文', '填充文本', '排版', 'placeholder'],
  order: 30,
  kind: 'generator',
})
