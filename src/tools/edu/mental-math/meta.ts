import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'mental-math',
  title: '口算题生成',
  summary: '按难度批量生成口算题与答案',
  category: 'edu',
  subcategory: '数学',
  keywords: ['口算', '口算题', '算术题', '练习', '小学', '加减乘除', '出题'],
  order: 8,
  kind: 'generator',
  tips: [
    '点一次「生成」换一批题，题目与答案在同一行，方便家长批改用。',
    '减法保证被减数大于减数，不会出现负数；除法暂未包含，避免除不尽的小数。',
  ],
})
