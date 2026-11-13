import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'css-minify',
  title: 'CSS 压缩',
  summary: '去注释、压空白，体积立减',
  category: 'dev',
  subcategory: '格式化',
  keywords: ['css', '压缩', 'minify', '去注释', '体积', '优化', '前端'],
  order: 65,
  kind: 'text-op',
  tips: [
    '注意 calc() 里的空格：正则压缩会把 a + b 变成 a+b，导致 calc 失效，压缩后务必抽查这类写法。',
    'content: "a;b" 这种字符串里的分号也可能被误伤，含复杂内容的 CSS 建议用构建工具压缩。',
  ],
})
