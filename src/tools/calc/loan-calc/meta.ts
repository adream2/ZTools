import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'loan-calc',
  title: '房贷计算',
  summary: '等额本息 / 等额本金，月供与总利息',
  category: 'calc',
  subcategory: '金融',
  keywords: ['房贷', '贷款', '月供', '利息', '等额本息', '等额本金', '计算器'],
  order: 11,
  kind: 'calc',
})
