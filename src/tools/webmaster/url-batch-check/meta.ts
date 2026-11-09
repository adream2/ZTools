import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'url-batch-check',
  title: '批量链接检测',
  summary: '一次检查多条链接是否可访问',
  category: 'webmaster',
  subcategory: '网络',
  keywords: ['批量', '链接', '死链', '检查', '可达性', 'url', '检测'],
  privacy: 'network',
  networkHosts: ['目标站点本身'],
  badge: 'limited',
  order: 25,
})
