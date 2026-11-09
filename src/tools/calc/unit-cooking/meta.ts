import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'unit-cooking',
  title: '烹饪单位',
  summary: '杯、勺、毫升、克互相换算',
  category: 'calc',
  subcategory: '生活',
  keywords: ['烹饪', '烘焙', '杯', '汤匙', '茶匙', '克', '毫升', '配方'],
  order: 25,
  kind: 'calc',
})
