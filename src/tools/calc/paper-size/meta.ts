import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'paper-size',
  title: '纸张尺寸',
  summary: 'A / B / C 系列尺寸对照',
  category: 'calc',
  subcategory: '生活',
  keywords: ['纸张', '尺寸', 'a4', 'a3', 'b5', '打印', '开本', '毫米'],
  order: 27,
  kind: 'lookup',
})
