import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'robots-txt',
  title: 'robots.txt 生成',
  summary: '可视化配置规则，实时生成并校验',
  category: 'webmaster',
  keywords: ['robots', 'robots.txt', '爬虫', 'seo', '索引', 'allow', 'disallow', 'sitemap'],
  order: 4,
})
