import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'uuid',
  title: 'UUID 生成',
  summary: '批量生成 v4 / v7，支持大写与去连字符',
  category: 'dev',
  keywords: ['uuid', 'guid', '唯一标识', 'random', '随机', 'v4', 'v7', '生成'],
  order: 4,
})
