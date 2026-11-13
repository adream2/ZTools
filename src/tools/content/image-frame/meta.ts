import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-frame',
  title: '图片加相框',
  summary: '加边框与拍立得式底部留白',
  category: 'content',
  subcategory: '图片',
  keywords: ['相框', '边框', '加白边', '拍立得', '图片边框', '留白', '图片'],
  order: 34,
  kind: 'file-op',
  tips: [
    '拍立得风格的关键是底部留白比四周宽，比例大约 1:3，写上手写体文字就有那味了。',
    '输出 PNG 保留原图质量；如果原图是照片，加完框再存 JPEG 体积会小很多。',
  ],
})
