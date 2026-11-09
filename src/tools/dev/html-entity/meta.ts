import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'html-entity',
  title: 'HTML 实体编解码',
  summary: '实体与字符互转，支持全字符转义',
  category: 'dev',
  subcategory: '编码',
  keywords: ['html', 'entity', '实体', '转义', 'escape', '&amp;', '&nbsp;', '编码'],
  order: 21,
  kind: 'text-op',
})
