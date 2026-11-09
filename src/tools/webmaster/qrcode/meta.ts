import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'qrcode',
  title: '二维码生成',
  summary: '自定义纠错、颜色与尺寸，导出 PNG / SVG',
  category: 'webmaster',
  keywords: ['qrcode', '二维码', 'qr', '生成', '扫码', '分享', 'svg', 'png'],
  order: 5,
  tips: [
    '纠错级别越高，能容忍的遮挡越多但容量越小；印刷品用 Q 或 H，屏幕显示 M 就够。',
    '二维码四周的留白（quiet zone）不能省，否则扫码器可能识别失败。',
    '内容超过容量会直接报错，长链接建议先用短链压缩。',
  ],
})
