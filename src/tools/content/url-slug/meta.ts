import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'url-slug',
  title: '标题转 Slug',
  summary: '中文标题转拼音 URL 别名',
  category: 'content',
  subcategory: '文本',
  keywords: ['slug', 'url', '别名', '拼音', '永久链接', 'seo', '链接'],
  order: 24,
  kind: 'text-op',
})
