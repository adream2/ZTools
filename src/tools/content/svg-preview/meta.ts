import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'svg-preview',
  title: 'SVG 预览',
  summary: '净化后渲染，检查尺寸并导出 PNG',
  category: 'content',
  keywords: ['svg', '矢量', '预览', '图标', 'icon', '转换成png', 'xml'],
  order: 6,
})
