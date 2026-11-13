import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'molar-mass',
  title: '摩尔质量',
  summary: '按化学式算式量与元素占比',
  category: 'edu',
  subcategory: '化学',
  keywords: ['摩尔质量', '相对分子质量', '化学式', '式量', '元素占比', '化学', 'mol'],
  order: 16,
  kind: 'calc',
  tips: [
    '支持括号与嵌套，如 Ca(OH)2、C6H12O6、(NH4)2SO4；不支持结晶水（·）与同位素标记。',
    '结晶水合物要自己把水合物部分加进去，例如 CuSO4·5H2O 的式量是 160 + 5×18。',
  ],
})
