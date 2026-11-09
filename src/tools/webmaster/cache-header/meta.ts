import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'cache-header',
  title: '缓存策略生成',
  summary: '按资源类型给出 Cache-Control 建议',
  category: 'webmaster',
  subcategory: '安全',
  keywords: ['缓存', 'cache-control', 'max-age', 'cdn', 'etag', '性能'],
  order: 16,
  kind: 'generator',
})
