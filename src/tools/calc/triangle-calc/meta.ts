import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'triangle-calc',
  title: '三角形计算',
  summary: '已知三边求面积和各个角',
  category: 'calc',
  subcategory: '数学',
  keywords: ['三角形', '海伦公式', '三边', '面积', '角度', '几何', '余弦定理'],
  order: 40,
  kind: 'calc',
  tips: [
    '任意两边之和必须大于第三边，等于时三点共线，构不成三角形。',
    '面积用海伦公式，角度用余弦定理；钝角那个角会大于 90°，其余两个必然小于 90°。',
  ],
})
