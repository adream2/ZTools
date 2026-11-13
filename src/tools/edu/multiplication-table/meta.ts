import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'multiplication-table',
  title: '乘法口诀表',
  summary: '生成 1–12 的乘法表',
  category: 'edu',
  subcategory: '数学',
  keywords: ['乘法口诀', '九九乘法表', '乘法表', '小学', '数学', '打印'],
  order: 21,
  kind: 'generator',
  tips: [
    '下三角形式就是课本上的九九表，去重后是 45 条；完整表是 81 条，用来练横竖查表。',
    '给低年级用建议先只到 5，一次背完 9 的量太大，容易打击积极性。',
  ],
})
