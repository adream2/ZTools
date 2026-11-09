import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'pinyin',
  title: '汉字转拼音',
  summary: '带声调、首字母、姓名模式',
  category: 'content',
  subcategory: '文本',
  keywords: ['拼音', 'pinyin', '声调', '首字母', '汉字', '注音'],
  order: 22,
  kind: 'text-op',
})
