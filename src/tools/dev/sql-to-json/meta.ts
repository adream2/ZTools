import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'sql-to-json',
  title: 'SQL 转 JSON',
  summary: '把 INSERT 语句转成 JSON 数组',
  category: 'dev',
  subcategory: '转换',
  keywords: ['sql', 'json', 'insert', '转换', '数据库', '导出', '数据'],
  order: 73,
  kind: 'text-op',
  tips: [
    '只解析 INSERT INTO … VALUES 形式，不含 UPDATE / SELECT / 存储过程。',
    '字段名取自括号里的列表；没有列表时按列序号输出数组，需要自己对照表结构。',
  ],
})
