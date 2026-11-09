import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-path',
  title: 'JSON 取值',
  summary: '按点路径或下标提取嵌套值',
  category: 'dev',
  subcategory: '工具',
  keywords: ['json', 'path', '取值', '提取', 'jsonpath', '路径', '查询'],
  order: 49,
})
