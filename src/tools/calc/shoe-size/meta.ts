import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'shoe-size',
  title: '鞋码换算',
  summary: '脚长与中、欧、美、英码对照',
  category: 'calc',
  subcategory: '生活',
  keywords: ['鞋码', '尺码', '脚长', '欧码', '美码', '英码', '换算'],
  order: 26,
  kind: 'calc',
})
