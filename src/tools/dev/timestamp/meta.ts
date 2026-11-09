import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'timestamp',
  title: '时间戳转换',
  summary: '秒 / 毫秒与日期互转，多时区对照',
  category: 'dev',
  keywords: ['timestamp', 'unix', '时间戳', '日期', 'date', '转换', '时区', 'timezone', 'utc'],
  order: 5,
  tips: [
    '10 位是秒、13 位是毫秒，工具会自动识别；显式指定单位更稳妥。',
    '时间段显示按本地时区换算，服务器与用户时区不同时结果会差几小时。',
    'new Date("2025-01-01") 按 UTC 解析、带时间则按本地解析，这是跨时区差 8 小时的常见原因。',
  ],
})
