import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'csv-to-sql',
  title: 'CSV 转 SQL',
  summary: '表格数据生成 INSERT 语句',
  category: 'dev',
  subcategory: '转换',
  keywords: ['csv', 'sql', 'insert', '建表', '导入', '数据库', '批量插入'],
  order: 45,
  kind: 'text-op',
})
