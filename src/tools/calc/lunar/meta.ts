import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'lunar',
  title: '农历转换',
  summary: '公历转农历，含干支与节气',
  category: 'calc',
  subcategory: '时间',
  keywords: ['农历', '阴历', '公历', '干支', '生肖', '节气', '传统'],
  order: 31,
  kind: 'calc',
})
