import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'sql-formatter',
  title: 'SQL 格式化',
  summary: '关键字大写、按子句换行',
  category: 'dev',
  subcategory: '格式化',
  keywords: ['sql', '格式化', 'mysql', 'postgres', '查询', '美化', '关键字'],
  order: 35,
  kind: 'text-op',
})
