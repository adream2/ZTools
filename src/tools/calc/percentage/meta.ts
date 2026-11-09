import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'percentage',
  title: '百分比计算',
  summary: '占比、增减率、按比例取值',
  category: 'calc',
  subcategory: '数学',
  keywords: ['百分比', '占比', '增长率', '折扣', '百分数', '计算'],
  order: 14,
  kind: 'calc',
})
