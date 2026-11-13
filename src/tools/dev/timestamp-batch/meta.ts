import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'timestamp-batch',
  title: '批量时间戳转换',
  summary: '一行一个，批量转日期或时间戳',
  category: 'dev',
  subcategory: '时间',
  keywords: ['时间戳', '批量', '转换', 'unix', '日期', '毫秒', '时间'],
  order: 77,
  kind: 'text-op',
  tips: [
    '自动识别秒与毫秒：10 位当秒、13 位当毫秒，超过 1e11 的数值都按毫秒处理。',
    '日期转时间戳会同时给秒和毫秒两列，方便直接复制到 SQL 或接口参数里。',
  ],
})
