import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'stock-average',
  title: '补仓成本',
  summary: '加仓后的持仓成本与回本价',
  category: 'calc',
  subcategory: '金融',
  keywords: ['补仓', '持仓成本', '摊薄', '回本', '股票', '基金', '成本价', '加仓'],
  order: 41,
  kind: 'calc',
  tips: [
    '补仓能摊低成本，但同时放大了总仓位；成本降了、亏的钱可能更多，别只看成本价。',
    'A 股买入有佣金与过户费，实际成本略高于公式结果，频繁小额补仓尤其明显。',
  ],
})
