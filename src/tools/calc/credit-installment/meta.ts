import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'credit-installment',
  title: '分期真实利率',
  summary: '把手续费折算成实际年化',
  category: 'calc',
  subcategory: '金融',
  keywords: ['分期', '信用卡', '手续费', '真实利率', 'irr', '年化', '账单分期'],
  order: 32,
  kind: 'calc',
  tips: [
    '「月费率 0.6%」听起来像年化 7.2%，实际年化接近 13%：因为本金逐月减少，手续费却按初始本金收。',
    '一次性收手续费比每期收更贵一点，因为钱在第一期就被拿走了，占用了你的资金时间价值。',
    '提前还款通常仍收全部手续费，这是分期最容易被忽略的坑。',
  ],
})
