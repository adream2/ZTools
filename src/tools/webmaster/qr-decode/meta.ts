import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'qr-decode',
  title: '二维码识别',
  summary: '从图片里读出二维码内容',
  category: 'webmaster',
  subcategory: '工具',
  keywords: ['二维码', '识别', '解码', 'qr', '扫一扫', '图片'],
  order: 22,
})
