import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'yaml-to-env',
  title: '配置转 .env',
  summary: 'YAML / JSON 拍平成环境变量',
  category: 'dev',
  subcategory: '转换',
  keywords: ['env', 'yaml', 'json', '环境变量', '配置', 'dotenv', 'docker'],
  order: 46,
  kind: 'text-op',
})
