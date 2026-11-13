import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-schema',
  title: 'JSON 转 Schema',
  summary: '按样例反推 JSON Schema',
  category: 'dev',
  subcategory: '转换',
  keywords: ['json schema', 'schema', 'json', '校验', '类型推断', '接口', '生成'],
  order: 76,
  kind: 'text-op',
  tips: [
    '数组元素类型不一致时会合并成 anyOf，这正是需要你人工确认的地方。',
    '所有字段都会被标成 required，实际接口里可选字段要自己删掉。',
  ],
})
