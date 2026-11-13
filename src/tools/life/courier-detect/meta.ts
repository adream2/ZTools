import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'courier-detect',
  title: '快递公司识别',
  summary: '按单号前缀判断是哪家快递',
  category: 'life',
  subcategory: '生活',
  keywords: ['快递', '单号', '运单号', '顺丰', '中通', '圆通', '韵达', '申通', '极兔', '物流'],
  order: 10,
  kind: 'generator',
  tips: [
    '识别只看号码格式，不联网、不查物流轨迹，也不会把单号发出去。',
    '纯数字单号最容易撞车：7 开头多属中通，3/4 开头多属韵达，但各家都发过同段号，最终以物流页为准。',
  ],
})
