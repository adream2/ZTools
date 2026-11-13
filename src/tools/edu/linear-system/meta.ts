import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'linear-system',
  title: '二元一次方程组',
  summary: '两个方程求解与图形交点',
  category: 'edu',
  subcategory: '数学',
  keywords: ['二元一次方程组', '解方程', '行列式', '克拉默', '交点', '数学', '联立'],
  order: 11,
  kind: 'calc',
  tips: [
    '系数行列式为 0 时两直线平行或重合：平行无解，重合则有无穷多解。',
    '解就是两条直线的交点坐标，画图时可以直接用这个结论验算。',
  ],
})
