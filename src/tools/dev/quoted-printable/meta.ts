import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'quoted-printable',
  title: 'Quoted-Printable',
  summary: '邮件里的 =E4=B8=AD 编解码',
  category: 'dev',
  subcategory: '编码',
  keywords: ['quoted-printable', 'qp', '邮件编码', '乱码', '=e4', '邮件', '编码'],
  order: 63,
  kind: 'text-op',
  tips: [
    '邮件正文里成串的 =E4=B8=AD 就是它：中文按 UTF-8 拆成字节，每个字节写成 =XX。',
    '软换行（行尾单个 =）只是排版用，解码时会自动去掉，不影响内容。',
  ],
})
