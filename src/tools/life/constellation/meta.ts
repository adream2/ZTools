import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'constellation',
  title: '星座查询',
  summary: '按生日查星座、四象与守护星',
  category: 'life',
  subcategory: '趣味',
  keywords: ['星座', '十二星座', '生日', '星座查询', '四象', '守护星'],
  order: 2,
  kind: 'calc',
  tips: [
    '星座边界按公历日期划分，各占星流派的交界日可能差一天，生日正好卡在边界时会显示前一个星座。',
    '这里是太阳星座（按出生日期），上升、月亮星座需要精确出生时间和地点，不是纯日期能算的。',
  ],
})
