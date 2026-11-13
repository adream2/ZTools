import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'blood-pressure',
  title: '血压分级',
  summary: '按收缩压舒张压判断分级',
  category: 'life',
  subcategory: '健康',
  keywords: ['血压', '高血压', '收缩压', '舒张压', '血压分级', '健康', '低压'],
  order: 13,
  kind: 'calc',
  tips: [
    '诊室血压 ≥140/90 才算高血压，家里自测的标准是 ≥135/85，两者不能混着比。',
    '单次偏高不代表高血压，要在不同日期测三次以上；白大衣效应很常见。',
    '本工具只做分级参考，确诊与用药请找医生。',
  ],
})
