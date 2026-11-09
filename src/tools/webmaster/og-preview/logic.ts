import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'title', label: '标题', type: 'text' as const, default: 'ZT 工具箱 · 纯本地在线工具' },
  { key: 'desc', label: '描述', type: 'text' as const, default: '无广告、无注册，数据不出浏览器' },
  { key: 'site', label: '站点名', type: 'text' as const, default: 'ZT 工具箱' },
  { key: 'url', label: '链接', type: 'text' as const, default: 'https://example.com/' },
  { key: 'image', label: '图片地址', type: 'text' as const, default: 'https://example.com/og.png' },
]

function generate(values: Record<string, string | number | boolean>): string {
  const title = String(values.title ?? '').trim()
  if (!title) throw new Error('标题不能为空')
  const desc = String(values.desc ?? '').trim()
  const site = String(values.site ?? '').trim()
  const url = String(values.url ?? '').trim()
  const image = String(values.image ?? '').trim()

  const lines = [
    `<!-- 分享卡片 -->`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
  ]
  if (site) lines.push(`<meta property="og:site_name" content="${site}" />`)
  if (url) lines.push(`<meta property="og:url" content="${url}" />`)
  if (image) {
    lines.push(`<meta property="og:image" content="${image}" />`)
    lines.push(`<meta property="og:image:width" content="1200" />`)
    lines.push(`<meta property="og:image:height" content="630" />`)
  }
  lines.push('', `<meta name="twitter:card" content="summary_large_image" />`)
  lines.push(`<meta name="twitter:title" content="${title}" />`)
  lines.push(`<meta name="twitter:description" content="${desc}" />`)
  if (image) lines.push(`<meta name="twitter:image" content="${image}" />`)

  return lines.join('\n')
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '分享图建议 1200×630，微信会缓存首次抓取结果',
  resultLabel: 'meta 标签',
}

export default logic
