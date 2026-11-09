import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'naming-case',
  title: '命名风格转换',
  summary: '驼峰、下划线、短横线、常量互转',
  category: 'dev',
  subcategory: '转换',
  keywords: ['命名', 'camelCase', 'snake_case', 'kebab-case', 'PascalCase', '下划线', '驼峰', '变量名'],
  order: 24,
  kind: 'text-op',
})
