import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'rmb-upper',
  title: '人民币大写',
  summary: '金额转财务大写，含角分处理',
  category: 'calc',
  subcategory: '金融',
  keywords: ['人民币', '大写', '金额', '财务', '支票', '报销'],
  order: 16,
  kind: 'text-op',
})
