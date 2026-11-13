import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'gcd-lcm',
  title: '最大公约数 / 最小公倍数',
  summary: '多个整数的公约数与公倍数',
  category: 'edu',
  subcategory: '数学',
  keywords: ['最大公约数', '最小公倍数', 'gcd', 'lcm', '约数', '倍数', '数学'],
  order: 3,
  kind: 'calc',
  tips: [
    '用逗号、空格或换行分隔，可以一次算 2–10 个数。',
    '最小公倍数用 BigInt 计算，超过 2^53 的大数也不会算错。',
  ],
})
