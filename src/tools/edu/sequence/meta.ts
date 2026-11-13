import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'sequence',
  title: '数列计算',
  summary: '等差等比数列的通项与求和',
  category: 'edu',
  subcategory: '数学',
  keywords: ['数列', '等差数列', '等比数列', '通项', '求和', '公差', '公比'],
  order: 12,
  kind: 'calc',
  tips: [
    '等差数列求和用 (首项+末项)×项数÷2，等比数列要分公比是否为 1。',
    '公比为负时会正负交替，公比绝对值小于 1 时求和会收敛，别想当然按发散算。',
  ],
})
