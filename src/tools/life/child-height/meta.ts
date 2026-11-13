import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'child-height',
  title: '孩子身高预测',
  summary: '按父母身高算遗传靶身高',
  category: 'life',
  subcategory: '健康',
  keywords: ['身高', '遗传身高', '孩子身高', '靶身高', '儿童', '发育', '预测'],
  order: 16,
  kind: 'calc',
  tips: [
    '这是遗传靶身高（CMH 公式），只说明基因给的范围，上下浮动 5 cm 都算正常。',
    '睡眠和运动的影响被严重低估：生长激素在深睡时分泌，长期晚睡的孩子更容易低于靶身高。',
    '如果年增长不足 5 cm，或明显偏离同龄人，先查骨龄而不是补钙。',
  ],
})
