import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ping-test',
  title: '连通性测试',
  summary: '连续探测延迟与成功率',
  category: 'webmaster',
  subcategory: '网络',
  keywords: ['ping', '延迟', '连通性', '测速', '网络', '响应时间'],
  privacy: 'network',
  networkHosts: ['目标站点本身'],
  badge: 'limited',
  order: 24,
})
