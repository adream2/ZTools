import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'timezone',
  title: '时区转换',
  summary: '同一时刻在不同时区的本地时间',
  category: 'calc',
  subcategory: '时间',
  keywords: ['时区', 'timezone', 'utc', '转换', '时差', '跨时区'],
  order: 30,
  kind: 'calc',
})
