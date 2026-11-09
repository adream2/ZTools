import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'hash',
  title: '哈希计算',
  summary: 'MD5、SHA-1/256/384/512，支持文件',
  category: 'dev',
  keywords: ['hash', '哈希', '摘要', 'md5', 'sha1', 'sha256', 'sha512', '校验', 'checksum', '文件指纹'],
  order: 7,
  tips: [
    'MD5 与 SHA-1 存在碰撞攻击，只适合文件完整性校验，不要用于签名或密码存储。',
    'MD5 走分块流式读取，大文件也不会占满内存；SHA 系列受浏览器 API 限制必须整体读入。',
    '同一个文件用不同算法得到的摘要长度不同，校验时两边必须用同一种算法。',
  ],
})
