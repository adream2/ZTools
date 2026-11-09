import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'word-count',
  title: '字数统计',
  summary: '中英文分别计数，含阅读时长与关键词密度',
  category: 'content',
  keywords: ['字数', '统计', 'word count', '字符', '段落', '阅读时长', '文案', '公众号'],
  order: 5,
})
