import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'sitemap-gen',
  title: 'sitemap 生成',
  summary: 'URL 列表生成 sitemap.xml',
  category: 'webmaster',
  subcategory: 'SEO',
  keywords: ['sitemap', 'xml', 'seo', '站点地图', '收录', '生成'],
  order: 11,
  kind: 'text-op',
})
