import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'matrix-determinant',
  title: '矩阵行列式',
  summary: '2–5 阶行列式与可逆判断',
  category: 'edu',
  subcategory: '数学',
  keywords: ['矩阵', '行列式', 'det', '可逆', '线性代数', '迹', '数学'],
  order: 19,
  kind: 'calc',
  tips: [
    '行列式为 0 表示矩阵不可逆，对应线性方程组要么无解、要么有无穷多解。',
    '每行一行，空格或逗号分隔；行数不等于列数会直接报错，非方阵没有行列式。',
  ],
})
