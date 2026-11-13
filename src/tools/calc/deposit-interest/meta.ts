import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'deposit-interest',
  title: '存款利息',
  summary: '定期存款利息与本息合计',
  category: 'calc',
  subcategory: '金融',
  keywords: ['存款', '利息', '定期', '本息', '银行利率', '活期', '理财'],
  order: 31,
  kind: 'calc',
  tips: [
    '国内定期存款按单利计息，到期不取才转存；到期自动转存才产生类似复利的效果。',
    '提前支取一律按活期利率算，哪怕只差一天到期，利息差得非常多。',
  ],
})
