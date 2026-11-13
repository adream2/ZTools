import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'chemical-balance',
  title: '化学方程式配平',
  summary: '按元素守恒自动求系数',
  category: 'edu',
  subcategory: '化学',
  keywords: ['化学方程式', '配平', '系数', '守恒', '化学反应', '化学', '元素'],
  order: 17,
  kind: 'calc',
  tips: [
    '用 -> 或 = 分隔反应物与生成物，多个物质用 + 连接；只支持单线反应，不支持离子式与条件符号。',
    '多解的情况（同一组元素可有多种配比）会直接提示无法唯一配平，需要自己补约束。',
  ],
})
