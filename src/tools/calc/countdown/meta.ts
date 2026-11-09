import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'countdown',
  title: '日期倒计时',
  summary: '距目标日期还有多少天',
  category: 'calc',
  subcategory: '时间',
  keywords: ['倒计时', '天数', '纪念日', '距离', '日期', '还有多久'],
  order: 28,
  kind: 'calc',
})
