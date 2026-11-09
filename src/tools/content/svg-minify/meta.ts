import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'svg-minify',
  title: 'SVG 压缩',
  summary: '去注释、空白与冗余属性',
  category: 'content',
  subcategory: '图形',
  keywords: ['svg', '压缩', 'minify', '优化', '图标', '体积'],
  order: 13,
  kind: 'text-op',
})
