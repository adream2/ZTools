import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'periodic-table',
  title: '元素周期表',
  summary: '118 种元素的符号与原子量',
  category: 'edu',
  subcategory: '化学',
  keywords: ['元素周期表', '化学元素', '原子序数', '原子量', '元素符号', '化学'],
  order: 10,
  kind: 'lookup',
  tips: [
    '相对原子质量取 IUPAC 常规值，多数保留到小数点后两位；没有稳定同位素的元素用最稳定同位素的质量数。',
    '104 号以后的元素只在实验室合成，半衰期以秒计，名称里常有生僻字，部分字体可能显示为方框。',
  ],
})
