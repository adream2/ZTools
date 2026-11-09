import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'roman',
  title: '罗马数字',
  summary: '阿拉伯数字与罗马数字互转',
  category: 'calc',
  subcategory: '数字',
  keywords: ['roman', '罗马数字', '转换', '数字', '罗马'],
  order: 21,
  kind: 'text-op',
})
