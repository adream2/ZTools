import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-rounded',
  title: '圆角图片',
  summary: '给图片加圆角或做成卡片',
  category: 'content',
  subcategory: '图片',
  keywords: ['圆角', '图片圆角', '卡片', '圆角矩形', '头像', '图片'],
  order: 31,
  kind: 'file-op',
  tips: [
    '圆角半径按像素算，不随图片尺寸缩放：同一半径在小图上很圆，在大图上几乎看不出来。',
    '输出 PNG 时圆角外是透明的，贴到深色背景上不会出现白边。',
  ],
})
