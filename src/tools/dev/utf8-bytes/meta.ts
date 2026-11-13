import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'utf8-bytes',
  title: 'UTF-8 字节查看',
  summary: '看中文到底占几个字节',
  category: 'dev',
  subcategory: '编码',
  keywords: ['utf-8', '字节', '十六进制', '编码', '乱码', '字符集', 'hex'],
  order: 72,
  kind: 'text-op',
  tips: [
    '一个汉字在 UTF-8 里固定占 3 字节，GBK 占 2 字节——乱码长度不对，先看这里。',
    '反向转换要求十六进制成对出现，允许空格、逗号和换行分隔。',
  ],
})
