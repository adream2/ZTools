import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'tax-calc',
  title: '个税计算',
  summary: '工资薪金与年终奖个税估算',
  category: 'calc',
  subcategory: '金融',
  keywords: ['个税', '所得税', '工资', '年终奖', '五险一金', '到手', '税后'],
  order: 13,
  kind: 'calc',
})
