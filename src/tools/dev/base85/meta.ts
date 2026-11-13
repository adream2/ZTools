import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'base85',
  title: 'Base85 编解码',
  summary: 'Ascii85 编码，比 Base64 更省',
  category: 'dev',
  subcategory: '编码',
  keywords: ['base85', 'ascii85', '编码', '解码', 'adobe', 'pdf', '图片嵌入'],
  order: 71,
  kind: 'text-op',
  tips: [
    'Ascii85 每 4 字节压成 5 个字符，比 Base64 省约 5%，PDF 和 PostScript 里常见。',
    '连续四个零字节会缩写成一个 z，解码时展开；文本里自己带的 z 不会被误认，因为位置对齐。',
  ],
})
