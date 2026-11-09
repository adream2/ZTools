import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'dice',
  title: '骰子抽取',
  summary: '掷骰子、随机点名，本地生成',
  category: 'calc',
  subcategory: '随机',
  keywords: ['骰子', 'dice', '抽签', '随机', '点名', '摇号'],
  order: 29,
  kind: 'generator',
})
