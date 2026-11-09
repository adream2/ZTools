import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'base32',
  title: 'Base32 编解码',
  summary: 'RFC 4648 标准，常用于 TOTP 密钥',
  category: 'dev',
  subcategory: '编码',
  keywords: ['base32', '编码', '解码', 'totp', '2fa', 'rfc4648'],
  order: 50,
  kind: 'text-op',
})
