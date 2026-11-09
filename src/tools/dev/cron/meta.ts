import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'cron',
  title: 'Cron 表达式',
  summary: '中文解释 + 未来 5 次触发时间',
  category: 'dev',
  keywords: ['cron', 'crontab', '定时', '表达式', '调度', 'schedule', '任务'],
  order: 10,
})
