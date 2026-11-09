import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ipv4-convert',
  title: 'IPv4 转换',
  summary: '点分十进制与整数互转',
  category: 'dev',
  subcategory: '网络',
  keywords: ['ipv4', 'ip', '整数', '转换', '点分', 'ip地址'],
  order: 42,
  kind: 'calc',
})
