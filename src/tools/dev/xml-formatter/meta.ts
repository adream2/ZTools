import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'xml-formatter',
  title: 'XML 格式化',
  summary: '缩进美化、压缩、转 JSON',
  category: 'dev',
  subcategory: '格式化',
  keywords: ['xml', '格式化', 'beautify', '压缩', 'minify', '转json', '标签'],
  order: 34,
  kind: 'text-op',
})
