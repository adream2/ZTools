import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'markdown-table',
  title: 'Markdown 表格',
  summary: '按行列数生成对齐的表格骨架',
  category: 'content',
  subcategory: '文本',
  keywords: ['markdown', '表格', 'table', '生成', 'md', '排版'],
  order: 20,
  kind: 'generator',
})
