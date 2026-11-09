import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'discount',
  title: '折扣计算',
  summary: '折扣、满减、折上折一起算',
  category: 'calc',
  subcategory: '金融',
  keywords: ['折扣', '打折', '满减', '优惠', '实付', '省多少', '购物'],
  order: 20,
  kind: 'calc',
})
