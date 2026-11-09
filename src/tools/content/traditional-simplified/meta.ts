import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'traditional-simplified',
  title: '繁简转换',
  summary: '简体与繁体互转，支持台湾用词',
  category: 'content',
  subcategory: '文本',
  keywords: ['繁体', '简体', '繁简', '转换', 'opencc', '中文'],
  order: 21,
  kind: 'text-op',
})
