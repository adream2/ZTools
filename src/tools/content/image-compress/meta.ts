import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-compress',
  title: '图片压缩',
  summary: '调整尺寸与质量，导出 WebP / JPEG / PNG',
  category: 'content',
  keywords: ['图片', '压缩', 'image', 'compress', 'webp', 'jpg', 'png', '尺寸', '缩小', '优化'],
  order: 1,
  tips: [
    'WebP 通常比 JPEG 小 25–35%，但老版本 Safari 与部分安卓 WebView 不支持，兼容优先选 JPEG。',
    'JPEG 不支持透明，工具会自动铺白底；需要透明就选 PNG 或 WebP。',
    '把最长边压到 1600px 以内，通常比单纯降质量更有效，而且肉眼几乎看不出差别。',
  ],
})
