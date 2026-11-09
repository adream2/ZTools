import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'referer-policy',
  title: 'Referrer 策略',
  summary: '八种策略的含义与适用场景',
  category: 'webmaster',
  subcategory: '安全',
  keywords: ['referrer', 'referer', '策略', '隐私', '防盗链', 'header'],
  order: 17,
  kind: 'lookup',
})
