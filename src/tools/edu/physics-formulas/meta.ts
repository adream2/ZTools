import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'physics-formulas',
  title: '物理公式速查',
  summary: '力学电磁热学常用公式',
  category: 'edu',
  subcategory: '物理',
  keywords: ['物理', '公式', '力学', '电学', '热学', '牛顿', '欧姆', '速度', '学习'],
  order: 14,
  kind: 'lookup',
  tips: [
    '单位必须统一到国际单位制再代入，克、厘米、分钟直接算出来的结果一定是错的。',
    '公式里的 v 在匀速和平均速度两种语境下含义不同，看题目给的是初末速度还是总位移。',
  ],
})
