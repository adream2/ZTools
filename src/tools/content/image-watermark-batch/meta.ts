import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-watermark-batch',
  title: '批量加水印',
  summary: '一次给多张图加文字水印',
  category: 'content',
  subcategory: '图片',
  keywords: ['水印', '批量水印', '文字水印', '加水印', '版权', '图片'],
  order: 36,
  kind: 'file-op',
  tips: [
    '水印透明度 40%–60% 既能防盗又不影响看图，超过 70% 就变成遮挡了。',
    '平铺水印最难去掉，但会让图片显得杂乱；个人作品集用右下角单点更体面。',
  ],
})
