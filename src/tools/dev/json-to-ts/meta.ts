import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-to-ts',
  title: 'JSON 转类型',
  summary: 'JSON 生成 TS 接口、Go 结构体、Zod',
  category: 'dev',
  subcategory: '转换',
  keywords: ['json', 'typescript', 'interface', 'go', 'struct', 'zod', '类型', '代码生成'],
  order: 32,
  kind: 'text-op',
})
