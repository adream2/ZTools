import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'curl-to-code',
  title: 'curl 转代码',
  summary: '把 curl 命令转成 fetch / axios / Python',
  category: 'dev',
  subcategory: '转换',
  keywords: ['curl', 'fetch', 'axios', 'python', 'requests', '转换', '代码生成', '接口'],
  order: 36,
  kind: 'text-op',
})
