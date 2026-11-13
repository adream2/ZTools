import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'binomial-distribution',
  title: '二项分布',
  summary: 'n 次试验命中 k 次的概率',
  category: 'edu',
  subcategory: '数学',
  keywords: ['二项分布', '概率', '伯努利', '期望', '方差', '组合数', '数学'],
  order: 20,
  kind: 'calc',
  tips: [
    '每次试验相互独立且成功概率固定，才叫二项分布；抽奖不放回这类场景应该用超几何分布。',
    'P(X=k) 是恰好 k 次，P(X≤k) 是至多 k 次，两个值经常被混着用。',
  ],
})
