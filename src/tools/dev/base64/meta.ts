import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'base64',
  title: 'Base64 编解码',
  summary: '文本与文件互转，支持 URL-safe 变体',
  category: 'dev',
  keywords: ['base64', 'b64', '编码', '解码', 'encode', 'decode', 'url safe', '文件转base64', '图片转base64'],
  order: 2,
  tips: [
    'Base64 是编码不是加密，任何人都能还原，不要用来「保护」密码或密钥。',
    '体积会增加约 33%，大图内联进 CSS 反而拖慢首屏，超过 10KB 建议单独请求。',
    '解码二进制数据时如果提示不是合法 UTF-8，用「还原为文件」下载，避免信息丢失。',
  ],
})
