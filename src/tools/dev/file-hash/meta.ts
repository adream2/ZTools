import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'file-hash',
  title: '文件哈希',
  summary: '本地算多个文件的校验值',
  category: 'dev',
  subcategory: '校验',
  keywords: ['哈希', '文件哈希', 'md5', 'sha256', '校验', '完整性', '指纹'],
  order: 70,
  kind: 'file-op',
  tips: [
    '大文件按 4 MB 分块读取，不会一次性吃满内存；计算过程中页面可能轻微卡顿。',
    'MD5 和 SHA-1 已不适合做安全校验，但用来比对文件是否损坏仍然够用。',
  ],
})
