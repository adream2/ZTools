import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-escape',
  title: 'JSON 字符串转义',
  summary: '把文本转成可放进 JSON 的字符串',
  category: 'dev',
  subcategory: '文本',
  keywords: ['json', '转义', 'escape', '字符串', '反斜杠', '引号', 'unescape'],
  order: 64,
  kind: 'text-op',
  tips: [
    '转义结果不带首尾引号，直接粘贴到 JSON 的键值里即可；需要带引号就自己补一对。',
    '反转义支持 \\uXXXX 与 \\n、\\t 等常见转义，遇到非法转义会原样保留而不是报错。',
  ],
})
