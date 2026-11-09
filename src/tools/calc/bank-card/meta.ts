import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'bank-card',
  title: '银行卡校验',
  summary: 'Luhn 校验与卡组织识别',
  category: 'calc',
  subcategory: '金融',
  keywords: ['银行卡', 'luhn', '校验', '卡号', '银联', 'visa', 'mastercard'],
  order: 18,
  kind: 'calc',
})
