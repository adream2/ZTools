import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'snowflake',
  title: '雪花 ID 解析',
  summary: '拆解 64 位雪花 ID 的时间与机器位',
  category: 'dev',
  subcategory: '工具',
  keywords: ['snowflake', '雪花算法', 'id', '解析', '分布式', '时间戳', '序列'],
  order: 41,
  kind: 'calc',
})
