import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'url-parser',
  title: 'URL 解析',
  summary: '拆解协议、主机、路径与全部参数',
  category: 'webmaster',
  subcategory: '工具',
  keywords: ['url', '解析', '参数', 'query', '域名', '路径', 'parse'],
  order: 12,
  kind: 'calc',
})
