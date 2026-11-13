import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'logarithm',
  title: '对数计算',
  summary: '任意底对数与常用换算',
  category: 'edu',
  subcategory: '数学',
  keywords: ['对数', 'log', 'ln', 'lg', '换底公式', '指数', '数学'],
  order: 13,
  kind: 'calc',
  tips: [
    '真数必须大于 0，底数必须大于 0 且不等于 1，否则在实数范围内没有意义。',
    '换底公式 logₐb = ln b / ln a，计算器和代码里只有 ln / log10，靠它算任意底。',
  ],
})
