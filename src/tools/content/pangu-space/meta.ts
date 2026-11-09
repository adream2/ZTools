import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'pangu-space',
  title: '中英文加空格',
  summary: '汉字与英文数字之间自动补空格',
  category: 'content',
  subcategory: '文本',
  keywords: ['空格', 'pangu', '中英文', '排版', '标点', '文案'],
  order: 11,
  kind: 'text-op',
})
