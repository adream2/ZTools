import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'vigenere',
  title: '维吉尼亚密码',
  summary: '带密钥的古典替换密码',
  category: 'dev',
  subcategory: '加密',
  keywords: ['维吉尼亚', 'vigenere', '古典密码', '加密', '解密', '凯撒', '密钥'],
  order: 66,
  kind: 'calc',
  tips: [
    '只处理英文字母，中文、数字和标点原样保留，也不会消耗密钥的位置。',
    '密钥会循环使用；同一个密钥加密相同明文，结果永远一样，所以它早就不是安全加密了。',
  ],
})
