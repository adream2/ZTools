import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'gross-margin',
  title: '毛利率计算',
  summary: '毛利、加价率与目标定价',
  category: 'calc',
  subcategory: '金融',
  keywords: ['毛利', '毛利率', '加价率', '定价', '成本', '售价', '生意'],
  order: 37,
  kind: 'calc',
  tips: [
    '毛利率按售价算，加价率按成本算：成本 60 卖 100，毛利率 40%，加价率却是 66.7%，别混着报价。',
    '想把毛利率做到 40%，售价应该是成本 ÷ (1−40%)，不是成本 × 1.4。',
  ],
})
