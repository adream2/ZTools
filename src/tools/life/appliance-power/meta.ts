import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'appliance-power',
  title: '家电耗电计算',
  summary: '按功率与时长算电费',
  category: 'life',
  subcategory: '生活',
  keywords: ['电费', '耗电', '功率', '度电', '千瓦时', '空调', '家电', '省电'],
  order: 17,
  kind: 'calc',
  tips: [
    '空调、电热水器的铭牌功率是最大功率，实际耗电随负荷变化，算出来通常是上限。',
    '待机功耗看着小，机顶盒 + 路由器常年不断电，一年也能吃掉几十度。',
    '阶梯电价要按当地档位算，这里的单价只是平均参考值。',
  ],
})
