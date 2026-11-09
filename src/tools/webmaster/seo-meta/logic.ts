import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  { key: 'title', label: '标题', type: 'text' as const, default: 'ZT 工具箱 · 纯本地在线工具', hint: '建议 30 字内' },
  {
    key: 'desc',
    label: '描述',
    type: 'text' as const,
    default: '纯本地运行的中文在线工具箱，无广告、无注册，支持离线安装。',
    hint: '建议 80 字内',
  },
  { key: 'url', label: '页面地址', type: 'text' as const, default: 'https://example.com/' },
  { key: 'image', label: '分享图', type: 'text' as const, default: 'https://example.com/og.png' },
  { key: 'keywords', label: '关键词', type: 'text' as const, default: '在线工具,工具箱' },
  { key: 'twitter', label: '含 Twitter 卡', type: 'switch' as const, default: true },
]

const esc = (s: string) => s.replace(/"/g, '&quot;')

function generate(values: Record<string, string | number | boolean>): string {
  const title = String(values.title ?? '').trim()
  const desc = String(values.desc ?? '').trim()
  if (!title) throw new Error('标题不能为空')
  if ([...title].length > 60) throw new Error('标题超过 60 字，搜索结果会被截断')
  if ([...desc].length > 160) throw new Error('描述超过 160 字，搜索结果会被截断')

  const url = String(values.url ?? '').trim()
  const image = String(values.image ?? '').trim()
  const keywords = String(values.keywords ?? '').trim()

  const lines: string[] = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
  ]
  if (keywords) lines.push(`<meta name="keywords" content="${esc(keywords)}" />`)
  if (url) lines.push(`<link rel="canonical" href="${esc(url)}" />`)

  lines.push(
    '',
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
  )
  if (url) lines.push(`<meta property="og:url" content="${esc(url)}" />`)
  if (image) lines.push(`<meta property="og:image" content="${esc(image)}" />`)

  if (values.twitter) {
    lines.push(
      '',
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(desc)}" />`,
    )
    if (image) lines.push(`<meta name="twitter:image" content="${esc(image)}" />`)
  }

  return lines.join('\n')
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '标题超 30 字、描述超 80 字在搜索结果里会被截断，建议更短',
  resultLabel: 'meta 标签',
}

export default logic
