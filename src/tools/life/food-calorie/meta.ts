import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'food-calorie',
  title: '食物热量表',
  summary: '常见食物每 100 克热量',
  category: 'life',
  subcategory: '健康',
  keywords: ['热量', '卡路里', '食物热量', '减肥', 'kcal', '饮食', '营养'],
  order: 11,
  kind: 'lookup',
  tips: [
    '表里都是「生重、可食部」的数值：100 克生米煮成饭约 250 克，按熟重算会差一倍多。',
    '烹饪油几乎全是脂肪，一勺 10 克就有 90 kcal，清炒和油炸的差距主要在油。',
  ],
})
