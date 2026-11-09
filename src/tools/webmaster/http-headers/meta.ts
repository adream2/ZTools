import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'http-headers',
  title: '站点可达性检测',
  summary: '测响应状态与耗时；跨域响应头受浏览器限制',
  category: 'webmaster',
  keywords: ['http', 'headers', '响应头', '状态码', '可达性', '探测', 'ping', '网站检测', 'tls'],
  privacy: 'network',
  networkHosts: ['目标站点本身'],
  badge: 'limited',
  order: 3,
})
