import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'unicode-convert',
  title: 'Unicode 转换',
  summary: '中文与 \\uXXXX 转义互转',
  category: 'dev',
  subcategory: '编码',
  keywords: ['unicode', '转义', '\\u', '编码', '中文转码', 'escape', 'utf8'],
  order: 22,
  kind: 'text-op',
})
