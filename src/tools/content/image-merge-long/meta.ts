import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-merge-long',
  title: '多图拼接',
  summary: '多张图竖向拼成一张长图',
  category: 'content',
  subcategory: '图片',
  keywords: ['拼接', '长图', '拼图', '合并图片', '截图拼接', '图片'],
  order: 35,
  kind: 'file-op',
  tips: [
    '竖向拼接适合长截图、聊天记录；宽度不一致时按最长的那张画布，短图会被居中或左对齐。',
    '间距设 8–16 px 能明显区分图片边界，设 0 会糊成一整块。',
  ],
})
