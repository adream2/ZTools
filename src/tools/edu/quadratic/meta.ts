import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'quadratic',
  title: '一元二次方程',
  summary: '求根、判别式与顶点坐标',
  category: 'edu',
  subcategory: '数学',
  keywords: ['一元二次方程', '求根', '判别式', '韦达定理', '抛物线', '顶点', '数学'],
  order: 1,
  kind: 'calc',
  tips: [
    '判别式 b²−4ac 决定实根个数：大于 0 两个、等于 0 一个、小于 0 没有实根（有两个共轭复根）。',
    'a 为 0 时方程退化成一次方程，工具会单独处理，别直接套求根公式。',
  ],
})
