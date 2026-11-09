import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'text-diff',
  title: '文本对比',
  summary: '行级 / 词级差异，标出新增与删除',
  category: 'dev',
  keywords: ['diff', '对比', '差异', '比较', 'compare', '文本对比', 'patch'],
  order: 9,
})
