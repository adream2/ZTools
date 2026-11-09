import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'jwt',
  title: 'JWT 解析',
  summary: '拆解 header / payload，标出过期时间（不验签）',
  category: 'dev',
  keywords: ['jwt', 'token', 'json web token', '解析', 'decode', 'payload', 'bearer', '鉴权'],
  order: 6,
  tips: [
    '工具只做解码，不验证签名。判断 token 是否被篡改需要密钥，浏览器里没有密钥就无从验证。',
    'exp / nbf 按 UTC 秒计算，与后端一致；显示的是本地时间，跨时区时注意换算。',
    '把 token 粘贴到任何在线工具都意味着它已经泄露过，生产环境的 token 建议在本地解析。',
  ],
})
