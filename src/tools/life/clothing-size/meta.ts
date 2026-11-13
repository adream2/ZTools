import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'clothing-size',
  title: '服装尺码换算',
  summary: '按身高体重换算中欧美码',
  category: 'life',
  subcategory: '生活',
  keywords: ['尺码', '衣服', '服装', '身高体重', '欧码', '美码', 's m l', '买衣服'],
  order: 9,
  kind: 'calc',
  tips: [
    '国内号型写成「175/92A」，前一个数是身高、后一个数是胸围，A 表示标准体型，B 偏胖、Y 偏瘦。',
    '不同品牌版型差异比尺码表差异大得多，同码的修身款和宽松款能差两个号，拿不准就按胸围选。',
  ],
})
