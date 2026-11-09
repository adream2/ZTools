import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-watermark',
  title: '图片加水印',
  summary: '文字水印，位置与透明度可调',
  category: 'content',
  subcategory: '图片',
  keywords: ['水印', 'watermark', '图片', '版权', '署名', '防盗'],
  order: 29,
})
