import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'nginx-redirect',
  title: 'Nginx 重定向',
  summary: '旧路径批量生成 301 / 302 规则',
  category: 'webmaster',
  subcategory: 'SEO',
  keywords: ['nginx', 'redirect', '301', '重定向', '跳转', '迁移', 'rewrite'],
  order: 19,
  kind: 'text-op',
})
