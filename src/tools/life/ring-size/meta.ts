import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ring-size',
  title: '戒指尺寸换算',
  summary: '周长直径与中欧美号对照',
  category: 'life',
  subcategory: '生活',
  keywords: ['戒指', '手寸', '圈口', '戒指尺寸', '周长', '美码', '买戒指'],
  order: 12,
  kind: 'calc',
  tips: [
    '量手指要在傍晚：早晚手指粗细能差半号，太冷或刚运动完都会偏小。',
    '宽版戒指（5 毫米以上）建议加半号到一号，因为宽环更吃手指的肉。',
  ],
})
