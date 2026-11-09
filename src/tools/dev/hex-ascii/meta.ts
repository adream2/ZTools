import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'hex-ascii',
  title: 'Hex 与文本',
  summary: '十六进制、二进制与字符串互转',
  category: 'dev',
  subcategory: '编码',
  keywords: ['hex', '十六进制', 'ascii', '二进制', 'bin', '字节', '编码', '转换'],
  order: 23,
  kind: 'text-op',
})
