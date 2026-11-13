import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'irregular-verbs',
  title: '不规则动词表',
  summary: '常见动词三态与释义',
  category: 'edu',
  subcategory: '语言',
  keywords: ['英语', '不规则动词', '过去式', '过去分词', '三态', '背单词', '语法'],
  order: 15,
  kind: 'lookup',
  tips: [
    'AAA / ABB / ABC 三类分法只对记忆有用，实际按发音分组记得更牢（如 sing–sang–sung）。',
    'lie（躺）是 lay–lain，lay（放置）是 laid–laid，两者的过去式正好互换，是最常见的混淆点。',
  ],
})
