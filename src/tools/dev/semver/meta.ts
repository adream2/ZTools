import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'semver',
  title: '版本号工具',
  summary: '比较、递增、校验语义化版本',
  category: 'dev',
  subcategory: '工具',
  keywords: ['semver', '版本号', 'version', '比较', '递增', 'npm', '发布'],
  order: 39,
  kind: 'calc',
})
