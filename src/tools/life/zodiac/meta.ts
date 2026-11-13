import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'zodiac',
  title: '生肖属相',
  summary: '按年份查生肖、干支与纳音五行',
  category: 'life',
  subcategory: '趣味',
  keywords: ['生肖', '属相', '天干地支', '干支', '纳音', '五行', '本命年'],
  order: 3,
  kind: 'calc',
  tips: [
    '生肖按农历年划分，以立春为界；公历 1 月或 2 月初出生的人可能属上一个生肖，需要按农历生日复核。',
    '天干地支每 60 年循环一次，纳音五行是干支组合对应的另一套体系，与生肖五行不是一回事。',
  ],
})
