import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'stopwatch',
  title: '秒表计次',
  summary: '毫秒精度计时，支持分段记录',
  category: 'calc',
  subcategory: '时间',
  keywords: ['秒表', 'stopwatch', '计次', '计时', 'lap', '分段'],
  order: 34,
})
