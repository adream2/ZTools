import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'objectid',
  title: 'ObjectId 解析',
  summary: '拆解 MongoDB ObjectId 的时间与随机部分',
  category: 'dev',
  subcategory: '工具',
  keywords: ['objectid', 'mongodb', 'id', '解析', '时间戳', '数据库'],
  order: 40,
  kind: 'calc',
})
