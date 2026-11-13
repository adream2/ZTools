import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-long-split',
  title: '长图切分',
  summary: '超长图切成多张便于上传',
  category: 'content',
  subcategory: '图片',
  keywords: ['长图', '切图', '分割', '长截图', '切片', '公众号', '图片'],
  order: 32,
  kind: 'file-op',
  tips: [
    '重叠区域是为了防止切断文字行，10–30 px 通常就够，设太大每张都会重复一段。',
    '切成 JPEG 会自动铺白底；原图有透明背景时要选 PNG。',
  ],
})
