import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'radix',
  title: '进制转换',
  summary: '2 / 8 / 10 / 16 / 36 进制互转，支持大数',
  category: 'calc',
  keywords: ['进制', '二进制', '十六进制', '八进制', 'radix', 'binary', 'hex', 'decimal', '转换'],
  order: 2,
})
