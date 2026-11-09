import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'rot-cipher',
  title: 'ROT 与凯撒密码',
  summary: 'ROT13 / ROT5 / 凯撒位移加解密',
  category: 'dev',
  subcategory: '加密',
  keywords: ['rot13', 'rot5', '凯撒', 'caesar', '位移', '密码', '解密'],
  order: 51,
  kind: 'text-op',
})
