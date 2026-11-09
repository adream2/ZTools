import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'hmac',
  title: 'HMAC 签名',
  summary: '生成消息认证码，验证接口签名',
  category: 'dev',
  subcategory: '加密',
  keywords: ['hmac', '签名', 'sign', 'sha256', '密钥', '接口验签', '加密'],
  order: 48,
})
