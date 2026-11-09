import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'barcode-gen',
  title: '条形码生成',
  summary: 'Code128 / EAN 等格式，导 PNG',
  category: 'webmaster',
  subcategory: '工具',
  keywords: ['条形码', 'barcode', 'code128', 'ean13', '扫码', '标签', '打印'],
  order: 23,
})
