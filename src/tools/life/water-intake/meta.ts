import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'water-intake',
  title: '每日饮水量',
  summary: '按体重运动量算建议喝水',
  category: 'life',
  subcategory: '健康',
  keywords: ['喝水', '饮水量', '每日饮水', '补水', '水杯', '运动补水'],
  order: 8,
  kind: 'calc',
  tips: [
    '按体重 30–35 ml/kg 只是起点，出汗多、天气热、喝咖啡多的人要在此基础上加。',
    '短时间灌超过 1 升水会稀释血钠，运动后补水要少量多次，别一口气闷。',
  ],
})
