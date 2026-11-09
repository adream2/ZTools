import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'bill-split',
  title: 'AA 分账',
  summary: '含小费的人均分摊计算',
  category: 'calc',
  subcategory: '金融',
  keywords: ['aa', '分账', '人均', '小费', '聚餐', '账单'],
  order: 21,
  kind: 'calc',
})
