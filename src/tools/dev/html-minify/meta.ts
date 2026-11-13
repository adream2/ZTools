import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'html-minify',
  title: 'HTML 压缩',
  summary: '去注释、合并空白，保留 pre',
  category: 'dev',
  subcategory: '格式化',
  keywords: ['html', '压缩', 'minify', '去注释', '空白', '前端', '优化'],
  order: 75,
  kind: 'text-op',
  tips: [
    'pre、textarea、script、style 里的内容会被完整保留，不会把代码里的换行压没。',
    '只压空白不去属性引号，所以结果是安全的；想再小一点交给构建工具。',
  ],
})
