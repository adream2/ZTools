import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ua-parser',
  title: 'User-Agent 解析',
  summary: '识别浏览器、系统与设备类型',
  category: 'webmaster',
  subcategory: '工具',
  keywords: ['ua', 'user-agent', '浏览器', '系统', '设备', '识别', '爬虫'],
  order: 13,
  kind: 'calc',
})
