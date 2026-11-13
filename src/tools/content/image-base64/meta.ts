import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'image-base64',
  title: '图片转 Base64',
  summary: '图片转 DataURL，也能反向还原',
  category: 'content',
  subcategory: '图片',
  keywords: ['base64', '图片', 'dataurl', '内联', '转码', '图片转base64', '编码'],
  order: 26,
  tips: [
    'Base64 会让体积涨约 33%，超过 100 KB 的图片更该用外链，而不是内联进 HTML/CSS。',
    '内联的图片不会走浏览器缓存，同一张图在多个页面重复内联会被重复下载。',
  ],
})
