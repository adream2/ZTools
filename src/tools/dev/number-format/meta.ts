import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'number-format',
  title: '数字格式化',
  summary: '千分位、中文读法、科学计数',
  category: 'dev',
  subcategory: '转换',
  keywords: ['数字', '千分位', '格式化', '中文数字', '科学计数', '金额', 'number', 'format'],
  order: 26,
  kind: 'text-op',
})
