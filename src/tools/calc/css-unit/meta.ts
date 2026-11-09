import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'css-unit',
  title: 'CSS 单位换算',
  summary: 'px / rem / em / % / vw 互转',
  category: 'calc',
  subcategory: '数学',
  keywords: ['css', 'px', 'rem', 'em', 'vw', '单位', '换算', '响应式'],
  order: 35,
  kind: 'calc',
})
