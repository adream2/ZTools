import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'trig-table',
  title: '三角函数值',
  summary: '角度弧度互转与六个函数值',
  category: 'edu',
  subcategory: '数学',
  keywords: ['三角函数', 'sin', 'cos', 'tan', '弧度', '角度', '象限', '数学'],
  order: 5,
  kind: 'calc',
  tips: [
    'tan 在 90°、270° 处没有定义，工具会显示「不存在」而不是一个巨大的数。',
    '反三角函数算出来的是主值区间内的角，实际题目里要自己加周期或判断象限。',
  ],
})
