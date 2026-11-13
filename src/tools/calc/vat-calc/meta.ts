import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'vat-calc',
  title: '增值税计算',
  summary: '含税价与不含税价互算',
  category: 'calc',
  subcategory: '金融',
  keywords: ['增值税', '含税', '不含税', '税额', '发票', '税率', '开票'],
  order: 36,
  kind: 'calc',
  tips: [
    '「含税价 ÷ (1+税率)」才是不含税价，直接乘 (1−税率) 是常见错误，差额会累积。',
    '13% 适用货物销售，9% 适用交通运输与不动产，6% 适用现代服务，小规模纳税人常用 3%。',
  ],
})
