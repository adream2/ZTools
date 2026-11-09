import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'text-tools',
  title: '文本处理',
  summary: '大小写、去重、排序、去空行、加行号',
  category: 'calc',
  keywords: ['文本', 'text', '大小写', '去重', '排序', '空行', '行号', 'trim', '清理', '格式化'],
  order: 5,
})
