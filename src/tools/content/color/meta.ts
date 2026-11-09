import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'color',
  title: '颜色工具',
  summary: 'HEX / RGB / HSL 互转，WCAG 对比度检测',
  category: 'content',
  keywords: ['颜色', 'color', 'hex', 'rgb', 'hsl', '调色', '对比度', 'contrast', 'wcag', '无障碍'],
  order: 4,
})
