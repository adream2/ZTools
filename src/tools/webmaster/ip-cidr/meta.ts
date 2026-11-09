import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ip-cidr',
  title: 'CIDR 计算',
  summary: '网段、掩码、可用地址与范围',
  category: 'webmaster',
  subcategory: '网络',
  keywords: ['cidr', '子网', '掩码', '网段', 'ip', '广播地址', '可用地址'],
  order: 14,
  kind: 'calc',
})
