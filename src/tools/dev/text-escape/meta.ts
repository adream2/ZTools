import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'text-escape',
  title: '文本转义',
  summary: 'JS / SQL / JSON / 正则转义与还原',
  category: 'dev',
  subcategory: '编码',
  keywords: ['转义', 'escape', 'unescape', 'sql', 'json', 'regex', '引号', '换行'],
  order: 25,
  kind: 'text-op',
})
