import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'alcohol-intake',
  title: '酒精摄入估算',
  summary: '按酒量酒精度算纯酒精克数',
  category: 'life',
  subcategory: '健康',
  keywords: ['酒精', '饮酒', '纯酒精', '标准杯', '酒量', '血液酒精', '健康'],
  order: 15,
  kind: 'calc',
  tips: [
    '纯酒精按体积 × 酒精度 × 0.789 计算，白酒 50 ml 就接近 20 g，远超「适量」的量。',
    '血液酒精估算用 Widmark 公式，受体重、性别、空腹与否影响很大，误差可达 ±30%。',
    '结果不能用来判断能不能开车：唯一安全做法是不喝，或者留足 24 小时。',
  ],
})
