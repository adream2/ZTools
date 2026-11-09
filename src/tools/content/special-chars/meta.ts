import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'special-chars',
  title: '特殊符号',
  summary: '箭头、数学、货币符号速查复制',
  category: 'content',
  subcategory: '文本',
  keywords: ['符号', '特殊字符', '箭头', '数学', '货币', '复制', 'unicode'],
  order: 19,
  kind: 'lookup',
})
