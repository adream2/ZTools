import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'password',
  title: '随机密码',
  summary: '本地生成高强度密码，可评估熵值',
  category: 'calc',
  keywords: ['密码', 'password', '随机', '生成', '强密码', '安全', '密钥', 'passphrase'],
  order: 4,
  tips: [
    '「每类至少一个」会先各取一个再洗牌，避免密码固定以大写或符号开头。',
    '熵值 ≥ 75 bit 对重要账号算够用，但真正的风险是被撞库，同一个密码不要用在多个站点。',
    '服务端只接受 16 位以内时，优先加长而不是堆符号——长度对熵的贡献更大。',
  ],
})
