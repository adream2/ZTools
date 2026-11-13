import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'age-calc',
  title: '年龄计算',
  summary: '周岁虚岁、已活天数、下次生日',
  category: 'life',
  subcategory: '时间',
  keywords: ['年龄', '周岁', '虚岁', '生日', '出生日期', '多大', '属相'],
  order: 1,
  kind: 'calc',
  tips: [
    '周岁按「满一年才算一岁」算，生日当天才加一岁；虚岁出生即一岁，过年长一岁，两者最多差两岁。',
    '已活天数按公历日期差计算，不含出生当天；闰年不需要自己处理。',
  ],
})
