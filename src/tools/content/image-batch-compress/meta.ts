import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-batch-compress',
  title: '批量压缩图片',
  summary: '一次处理多张，统一限宽导出',
  category: 'content',
  subcategory: '图片',
  keywords: ['批量压缩', '图片压缩', '批量处理', 'webp', '缩小', '图片', '优化'],
  order: 33,
  kind: 'file-op',
  tips: [
    '先限最长边再降质量：1600px 以内 + 质量 80 通常能小 60% 以上，肉眼几乎看不出差别。',
    'WebP 体积最小，但老系统（Windows 7 图片查看器）打不开；要发给别人就选 JPEG。',
  ],
})
