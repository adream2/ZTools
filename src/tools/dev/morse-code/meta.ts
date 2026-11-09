import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'morse-code',
  title: '摩尔斯电码',
  summary: '文本与摩尔斯码互转',
  category: 'dev',
  subcategory: '编码',
  keywords: ['摩尔斯', 'morse', '电码', '编码', '解码', 'sos'],
  order: 52,
  kind: 'text-op',
})
