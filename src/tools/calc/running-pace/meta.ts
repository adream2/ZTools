import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'running-pace',
  title: '配速计算',
  summary: '距离时间换算配速与速度',
  category: 'calc',
  subcategory: '运动',
  keywords: ['配速', '跑步', '速度', '马拉松', '公里配速', '步频', '运动'],
  order: 38,
  kind: 'calc',
  tips: [
    '配速单位是「分′秒″/公里」，7′30″ 表示每公里 7 分 30 秒，不是 7.5 分钟。',
    '比赛后程掉速是常态，按目标配速直接乘距离算出的完赛时间通常偏乐观。',
  ],
})
