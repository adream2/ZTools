import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'blood-sugar',
  title: '血糖分级',
  summary: '空腹与餐后血糖区间判读',
  category: 'life',
  subcategory: '健康',
  keywords: ['血糖', '空腹血糖', '餐后血糖', '糖尿病', '糖耐量', 'mmol', '健康'],
  order: 14,
  kind: 'calc',
  tips: [
    '空腹指至少 8 小时没吃东西；只喝白水不算进食，但咖啡和茶会影响结果。',
    '一次超标不能确诊糖尿病，需要复测或做糖耐量试验；应激、感染、熬夜都会让血糖临时升高。',
  ],
})
