import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'base58',
  title: 'Base58 编解码',
  summary: '比特币字母表，去掉易混字符',
  category: 'dev',
  subcategory: '编码',
  keywords: ['base58', '编码', '解码', '比特币', 'btc', '地址', '钱包'],
  order: 62,
  kind: 'text-op',
  tips: [
    'Base58 去掉了 0OIl 这几个容易看错的字符，所以不能和 Base64 互相转换。',
    '解码结果不是合法 UTF-8 时直接显示十六进制，避免乱码吃掉原始字节。',
  ],
})
