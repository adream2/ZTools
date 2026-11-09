import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'seo-meta',
  title: 'SEO meta 生成',
  summary: '标题、描述、OG 标签一次生成',
  category: 'webmaster',
  subcategory: 'SEO',
  keywords: ['seo', 'meta', 'og', 'title', 'description', 'canonical', '分享卡片'],
  order: 18,
  kind: 'generator',
})
