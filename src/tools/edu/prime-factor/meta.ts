import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'prime-factor',
  title: '质因数分解',
  summary: '分解质因数并数约数个数',
  category: 'edu',
  subcategory: '数学',
  keywords: ['质因数', '分解', '约数', '质数', '因数', '小学数学', '数学'],
  order: 4,
  kind: 'calc',
  tips: [
    '试除到平方根就够了：如果 n 有大于 √n 的质因数，另一个因数必然小于 √n，早就被除掉了。',
    '支持到 10 亿以内；再大就要用 Pollard-Rho 之类的算法，浏览器里跑起来会卡。',
  ],
})
