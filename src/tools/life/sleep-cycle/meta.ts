import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'sleep-cycle',
  title: '睡眠周期',
  summary: '按入睡时间算最佳起床点',
  category: 'life',
  subcategory: '健康',
  keywords: ['睡眠', '睡眠周期', '起床时间', '深睡', 'rem', '作息', '熬夜'],
  order: 6,
  kind: 'calc',
  tips: [
    '一个睡眠周期约 90 分钟，在周期结束时醒来最不容易昏沉，所以按 4–6 个周期倒推比按小时算准。',
    '「入睡耗时」这一项别填 0：躺下到真正睡着通常要 10–20 分钟，漏掉它起床点会整体偏早。',
  ],
})
