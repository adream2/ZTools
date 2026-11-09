import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'css-radius',
  title: '圆角生成器',
  summary: '四角独立控制，输出不规则圆角',
  category: 'content',
  subcategory: 'CSS',
  keywords: ['css', 'border-radius', '圆角', '生成器', '形状'],
  order: 16,
  kind: 'generator',
})
