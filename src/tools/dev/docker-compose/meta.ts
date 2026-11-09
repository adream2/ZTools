import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'docker-compose',
  title: 'docker run 转 Compose',
  summary: '把 run 命令翻译成 compose.yaml',
  category: 'dev',
  subcategory: '转换',
  keywords: ['docker', 'compose', 'yaml', '容器', 'run', '转换', 'devops'],
  order: 37,
  kind: 'text-op',
})
