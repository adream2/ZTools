import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'compound-interest',
  title: '复利计算器',
  summary: '本金加定投的长期复利终值',
  category: 'calc',
  subcategory: '金融',
  keywords: ['复利', '定投', '终值', '年化收益', '72法则', '投资', '理财'],
  order: 30,
  kind: 'calc',
  tips: [
    '复利次数影响实际收益：同样 5% 年利率，按月复利比按年复利的实际年化高约 0.12 个百分点。',
    '72 法则只适合粗算：年化 6% 时约 12 年翻倍，年化 12% 时约 6 年，年化越高误差越大。',
    '这里的收益率是恒定的，真实市场会有回撤，长期定投的实际体验和这条曲线差很远。',
  ],
})
