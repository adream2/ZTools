import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'permutation',
  title: '排列组合',
  summary: '算排列数、组合数与阶乘',
  category: 'edu',
  subcategory: '数学',
  keywords: ['排列', '组合', '阶乘', 'cnm', 'anm', '概率', '数学'],
  order: 6,
  kind: 'calc',
  tips: [
    '排列讲顺序、组合不讲顺序：从 10 人里选 3 人排队是 A(10,3)，只选 3 人一组是 C(10,3)。',
    '阶乘用 BigInt 计算，50! 这种超长整数也能给完整结果，不会变成科学计数法。',
  ],
})
