import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ini-json',
  title: 'INI ↔ JSON',
  summary: 'ini 配置与 JSON 互转',
  category: 'dev',
  subcategory: '转换',
  keywords: ['ini', 'json', '转换', '配置文件', 'conf', 'cfg', '配置'],
  order: 61,
  kind: 'text-op',
  tips: [
    'INI 没有类型，转 JSON 时所有值都是字符串；需要数字请在 JSON 里自己改。',
    'JSON 转 INI 只支持两层结构（对象套对象），数组会被序列化成一行字符串。',
  ],
})
