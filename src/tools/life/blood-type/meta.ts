import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'blood-type',
  title: '血型遗传',
  summary: '父母血型推子女可能血型',
  category: 'life',
  subcategory: '健康',
  keywords: ['血型', 'abo', '遗传', '父母血型', '孩子血型', 'rh'],
  order: 7,
  kind: 'calc',
  tips: [
    'ABO 由一对等位基因决定，A 和 B 对 O 显性，所以 A 型可能是 AA 也可能是 AO。',
    '结果只覆盖 ABO 系统，Rh 阴性（熊猫血）是另一套系统，需要单独检测。',
    '血型不能用来做亲子鉴定，只能排除极少数组合。',
  ],
})
