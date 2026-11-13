import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'fertility-window',
  title: '排卵期推算',
  summary: '按周期推算排卵日与易孕窗口',
  category: 'life',
  subcategory: '健康',
  keywords: ['排卵期', '易孕期', '安全期', '月经周期', '备孕', '排卵日'],
  order: 5,
  kind: 'calc',
  tips: [
    '排卵日一般在下一次月经前 14 天，所以周期越短，排卵越早；周期不规律时这个推算基本失效。',
    '易孕窗口按精子存活 5 天、卵子存活 1 天估算，是概率区间而不是安全期承诺。',
    '把它当避孕手段失败率很高，避孕请用可靠方式。',
  ],
})
