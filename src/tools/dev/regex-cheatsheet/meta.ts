import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'regex-cheatsheet',
  title: '正则速查',
  summary: '常见场景的正则表达式',
  category: 'dev',
  subcategory: '参考',
  keywords: ['正则', 'regex', 'regexp', '匹配', '邮箱', '手机号', '校验', '速查'],
  order: 74,
  kind: 'lookup',
  tips: [
    '中文姓名、身份证这类规则有大量例外，正则会漏掉合法输入，别把校验全押在正则上。',
    '邮箱只校验基本结构即可，严格按 RFC 写的正则又长又慢，还得配合验证邮件才能真正确认。',
  ],
})
