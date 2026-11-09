import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'markdown',
  title: 'Markdown 预览',
  summary: '实时渲染、净化 HTML、导出单文件',
  category: 'content',
  keywords: ['markdown', 'md', '预览', '渲染', 'html', 'editor', '写作'],
  order: 3,
  tips: [
    '预览内容经过 DOMPurify 净化，内联脚本与事件属性会被移除，粘贴不可信内容也安全。',
    '导出的 HTML 是单文件，样式内联、无外部依赖，可以直接发给别人打开。',
    'GFM 表格与任务列表都支持，但不支持 Mermaid 图表与数学公式。',
  ],
})
