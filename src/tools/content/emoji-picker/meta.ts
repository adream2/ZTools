import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'emoji-picker',
  title: 'Emoji 搜索',
  summary: '按关键词找表情，一键复制',
  category: 'content',
  subcategory: '文本',
  keywords: ['emoji', '表情', '符号', '复制', '颜文字'],
  order: 18,
  kind: 'lookup',
})
