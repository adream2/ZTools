import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-circle',
  title: '圆形头像',
  summary: '裁成圆形头像并补齐底色',
  category: 'content',
  subcategory: '图片',
  keywords: ['圆形头像', '头像', '圆形裁剪', '头像制作', '裁圆', '图片'],
  order: 30,
  kind: 'file-op',
  tips: [
    '先按短边居中裁正方形再裁圆，所以人像尽量把脸放在画面中间偏上，避免裁掉半张脸。',
    '头像底色建议和要用的平台背景一致，不然边缘会出现一圈色带。',
  ],
})
