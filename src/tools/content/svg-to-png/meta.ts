import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'svg-to-png',
  title: 'SVG 转 PNG',
  summary: '矢量图导出指定宽度位图',
  category: 'content',
  subcategory: '图片',
  keywords: ['svg', 'png', '矢量', '转换', '图标', '导出', '位图'],
  order: 29,
  kind: 'file-op',
  tips: [
    'SVG 里引用了外部字体或图片时，浏览器会拒绝跨源加载，导出结果可能缺字或缺图，先把资源内联进 SVG。',
    '宽度填 2 倍或 4 倍尺寸导出，再在小尺寸显示，等于手动做高清屏适配。',
  ],
})
