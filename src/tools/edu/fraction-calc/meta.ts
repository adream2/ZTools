import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'fraction-calc',
  title: '分数计算器',
  summary: '分数加减乘除并约分',
  category: 'edu',
  subcategory: '数学',
  keywords: ['分数', '约分', '通分', '分数计算', '带分数', '小学数学'],
  order: 2,
  kind: 'calc',
  tips: [
    '结果会自动约到最简，并在下面给出带分数形式，方便对答案。',
    '分母为 0 时直接报错，不会返回 Infinity；负数分母会统一移到分子上。',
  ],
})
