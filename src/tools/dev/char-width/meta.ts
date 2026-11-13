import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'char-width',
  title: '字符显示宽度',
  summary: '算中文占几格，检查对齐',
  category: 'dev',
  subcategory: '文本',
  keywords: ['字符宽度', '全角', '半角', '对齐', '终端', 'emoji', '文本'],
  order: 78,
  kind: 'calc',
  tips: [
    '中文、全角标点、多数 emoji 占 2 格，英文与半角符号占 1 格，这就是终端里表格错位的根源。',
    'emoji 宽度各家渲染不一致，本工具按 2 格计算，遇到对齐问题优先怀疑它。',
  ],
})
