import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'password-strength',
  title: '密码强度',
  summary: '熵值估算与常见问题检查',
  category: 'calc',
  subcategory: '安全',
  keywords: ['密码强度', '熵', '安全', '弱密码', '检测', 'password'],
  order: 24,
  kind: 'calc',
})
