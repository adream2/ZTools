import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'pregnancy-due',
  title: '预产期计算',
  summary: '按末次月经算预产期与当前孕周',
  category: 'life',
  subcategory: '健康',
  keywords: ['预产期', '怀孕', '孕周', '末次月经', '孕期', '产检', '孕妇'],
  order: 4,
  kind: 'calc',
  tips: [
    '预产期按末次月经首日加 280 天（内格勒法则），前提是月经周期 28 天、排卵在第 14 天。',
    '周期偏长或偏短的人，实际排卵日会前移或后移，预产期误差可达一到两周，以早期 B 超为准。',
    '只有约 4% 的宝宝正好在预产期出生，前后两周内都算正常范围。',
  ],
})
