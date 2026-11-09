import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'mime-type',
  title: 'MIME 类型',
  summary: '扩展名与 Content-Type 对照查询',
  category: 'dev',
  subcategory: '查询',
  keywords: ['mime', 'content-type', '扩展名', '文件类型', 'type', '媒体类型'],
  order: 28,
  kind: 'lookup',
})
