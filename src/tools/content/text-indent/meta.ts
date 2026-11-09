import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'text-indent',
  title: '段落排版',
  summary: '首行缩进、段距、去空行一键规整',
  category: 'content',
  subcategory: '文本',
  keywords: ['排版', '缩进', '段落', '首行缩进', '段距', '公众号'],
  order: 12,
  kind: 'text-op',
})
