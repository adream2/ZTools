import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'id-card',
  title: '身份证解析',
  summary: '地区、生日、性别与校验位',
  category: 'calc',
  subcategory: '生活',
  keywords: ['身份证', '解析', '校验', '生日', '性别', '地区码'],
  order: 17,
  kind: 'calc',
})
