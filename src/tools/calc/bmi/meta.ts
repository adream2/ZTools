import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'bmi',
  title: 'BMI 计算',
  summary: '体质指数与健康区间判定',
  category: 'calc',
  subcategory: '健康',
  keywords: ['bmi', '体质指数', '身高', '体重', '肥胖', '健康', '减脂'],
  order: 12,
  kind: 'calc',
})
