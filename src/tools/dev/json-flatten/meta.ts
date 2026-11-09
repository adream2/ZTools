import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-flatten',
  title: 'JSON 扁平化',
  summary: '嵌套 JSON 与点路径键值互转',
  category: 'dev',
  subcategory: '转换',
  keywords: ['json', '扁平化', 'flatten', '嵌套', '点路径', '键值', '展平'],
  order: 44,
  kind: 'text-op',
})
