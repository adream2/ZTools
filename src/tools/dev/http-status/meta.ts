import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'http-status',
  title: 'HTTP 状态码',
  summary: '查状态码含义、成因与排查方向',
  category: 'dev',
  subcategory: '查询',
  keywords: ['http', '状态码', 'status', '404', '500', '301', '接口', '报错'],
  order: 27,
  kind: 'lookup',
})
