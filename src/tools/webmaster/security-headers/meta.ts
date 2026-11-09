import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'security-headers',
  title: '安全响应头生成',
  summary: 'CSP / HSTS / XFO 等配置一键生成',
  category: 'webmaster',
  subcategory: '安全',
  keywords: ['安全', '响应头', 'csp', 'hsts', 'x-frame-options', 'header', 'nginx'],
  order: 15,
  kind: 'generator',
})
