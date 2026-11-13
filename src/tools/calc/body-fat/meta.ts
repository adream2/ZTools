import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'body-fat',
  title: '体脂率估算',
  summary: '围度法估算体脂与去脂体重',
  category: 'calc',
  subcategory: '健康',
  keywords: ['体脂率', '体脂', '围度', '腰围', '颈围', '减脂', '健身', '身体成分'],
  order: 39,
  kind: 'calc',
  tips: [
    '用的是美国海军围度公式，误差约 ±3–5%，比体脂秤稳，但不如 DEXA。',
    '腰围要在肚脐水平量、自然呼气末读数；量错 2 cm，结果能差 2 个百分点。',
  ],
})
