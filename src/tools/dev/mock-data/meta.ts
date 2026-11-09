import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'mock-data',
  title: 'Mock 数据生成',
  summary: '批量生成姓名、手机、邮箱、地址',
  category: 'dev',
  subcategory: '生成',
  keywords: ['mock', '假数据', '测试数据', '姓名', '手机号', '邮箱', '地址', '造数'],
  order: 29,
  kind: 'generator',
})
