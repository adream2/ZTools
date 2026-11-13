import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'cubic-equation',
  title: '一元三次方程',
  summary: '求根、判别式与实根个数',
  category: 'edu',
  subcategory: '数学',
  keywords: ['一元三次方程', '三次方程', '求根', '卡尔达诺', '判别式', '数学'],
  order: 18,
  kind: 'calc',
  tips: [
    '判别式大于 0 时只有一个实根，另外两个是共轭复根；小于 0 时反而是三个实根，这点和二次方程直觉相反。',
    'a 为 0 就退化成二次方程，工具会直接提示，不会硬套三次公式。',
  ],
})
