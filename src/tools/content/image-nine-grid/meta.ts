import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-nine-grid',
  title: '九宫格切图',
  summary: '一张图切成 3×3 朋友圈九宫格',
  category: 'content',
  subcategory: '图片',
  keywords: ['九宫格', '切图', '朋友圈', '图片分割', '拼图', '九宫格切图', '图片'],
  order: 27,
  tips: [
    '会先按短边居中裁成正方形再切，所以原图不是正方形也不会被拉变形。',
    '九宫格发朋友圈时按 1→9 的顺序上传，顺序错了画面就接不上。',
  ],
})
