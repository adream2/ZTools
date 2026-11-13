import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'png-to-ico',
  title: 'PNG 转 ICO',
  summary: '生成多尺寸网站图标 favicon',
  category: 'content',
  subcategory: '图片',
  keywords: ['ico', 'favicon', '图标', 'png转ico', '网站图标', '图片'],
  order: 37,
  kind: 'file-op',
  tips: [
    'Windows 会按显示场景挑最合适的尺寸，所以 ICO 里同时塞 16/32/48/256 最省事。',
    '源图最好是正方形且背景透明，非正方形会被等比缩放并居中留白。',
  ],
})
