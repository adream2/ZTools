import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'markdown-toc',
  title: 'Markdown 目录',
  summary: '按标题自动生成 TOC',
  category: 'dev',
  subcategory: '文本',
  keywords: ['markdown', '目录', 'toc', '锚点', '文档', '标题', '大纲'],
  order: 79,
  kind: 'text-op',
  tips: [
    '代码块里的 # 不会被当成标题，缩进层级按最小标题级别对齐。',
    '锚点用 GitHub 规则生成：转小写、去标点、空格换横杠；中文标题在多数平台可直接用。',
  ],
})
