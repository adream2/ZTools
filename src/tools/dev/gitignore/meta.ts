import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'gitignore',
  title: '.gitignore 生成',
  summary: '按技术栈拼出忽略规则',
  category: 'dev',
  subcategory: '生成',
  keywords: ['gitignore', 'git', '忽略', 'node_modules', '构建产物', '仓库'],
  order: 38,
  kind: 'generator',
})
