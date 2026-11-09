import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-to-csv',
  title: 'JSON 与 CSV',
  summary: '数组与表格互转，支持自定义分隔符',
  category: 'dev',
  subcategory: '转换',
  keywords: ['json', 'csv', '表格', '转换', '导出', 'excel', 'tsv'],
  order: 33,
  kind: 'text-op',
})
