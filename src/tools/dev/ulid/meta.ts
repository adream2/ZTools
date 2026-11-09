import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ulid',
  title: 'ULID 生成',
  summary: '时间有序的 26 位 ID，可按时间排序',
  category: 'dev',
  subcategory: '生成',
  keywords: ['ulid', 'id', '生成', '有序', '唯一', '时间戳', 'crockford'],
  order: 31,
  kind: 'generator',
})
