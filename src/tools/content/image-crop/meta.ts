import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-crop',
  title: '图片裁剪',
  summary: '框选区域，按比例导出 PNG',
  category: 'content',
  keywords: ['裁剪', 'crop', '切图', '图片', '截图', '比例', '头像'],
  order: 2,
})
