import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'fuel-calc',
  title: '油耗计算',
  summary: '百公里油耗与每公里成本',
  category: 'calc',
  subcategory: '生活',
  keywords: ['油耗', '加油', '百公里', '油费', '汽车', '里程'],
  order: 23,
  kind: 'calc',
})
