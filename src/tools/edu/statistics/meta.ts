import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'statistics',
  title: '统计数据计算',
  summary: '平均、中位、标准差一次算完',
  category: 'edu',
  subcategory: '数学',
  keywords: ['统计', '平均数', '中位数', '众数', '标准差', '方差', '极差', '数据分析'],
  order: 7,
  kind: 'generator',
  tips: [
    '方差同时给样本（n−1）与总体（n）两个口径：描述这批数据本身用总体，用这批估计整体用样本。',
    '众数可能不止一个，全都列出来；没有重复值时显示「无」。',
  ],
})
