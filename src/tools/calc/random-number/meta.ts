import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'random-number',
  title: '随机数抽取',
  summary: '指定范围批量抽号，支持去重',
  category: 'calc',
  subcategory: '数学',
  keywords: ['随机数', '抽签', '抽奖', 'random', '号码', '去重'],
  order: 15,
  kind: 'generator',
})
