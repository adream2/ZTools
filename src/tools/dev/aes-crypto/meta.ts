import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'aes-crypto',
  title: 'AES 加解密',
  summary: 'AES-GCM 加密文本，密码派生密钥',
  category: 'dev',
  subcategory: '加密',
  keywords: ['aes', '加密', '解密', 'gcm', 'crypto', '对称加密', '密码'],
  order: 43,
})
