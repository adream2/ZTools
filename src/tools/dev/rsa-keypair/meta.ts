import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'rsa-keypair',
  title: 'RSA 密钥对',
  summary: '本地生成 PEM 格式公私钥',
  category: 'dev',
  subcategory: '加密',
  keywords: ['rsa', '密钥', 'pem', '公钥', '私钥', '非对称加密', '生成'],
  order: 53,
})
