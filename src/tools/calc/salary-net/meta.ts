import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'salary-net',
  title: '税后工资',
  summary: '按五险一金与专项扣除算到手',
  category: 'calc',
  subcategory: '金融',
  keywords: ['税后工资', '到手工资', '个税', '五险一金', '专项附加扣除', '工资计算'],
  order: 33,
  kind: 'calc',
  tips: [
    '按月度税率表速算，实际是全年累计预扣预缴：年初税率低、年底可能跳档，单月结果和工资条会有差异。',
    '社保与公积金按缴费基数算，不是按实发工资；基数有上下限，高薪人群实际比例会更低。',
    '专项附加扣除（房贷、租房、赡养老人、子女教育）直接减少应纳税所得额，别忘了填。',
  ],
})
