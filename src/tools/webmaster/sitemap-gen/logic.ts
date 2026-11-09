import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'simple', label: '基础 sitemap', group: '生成' },
  { id: 'withMeta', label: '带优先级与频率', group: '生成' },
  { id: 'urlset', label: '仅 URL 列表', group: '整理' },
]

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] ?? c)
}

function urlsOf(text: string): string[] {
  return text
    .split(/[\r\n,]+/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      if (/^https?:\/\//i.test(l)) return l
      if (l.startsWith('/')) return l
      return `https://${l}`
    })
}

function build(text: string, withMeta: boolean): string {
  const urls = urlsOf(text)
  if (!urls.length) throw new Error('没有解析到 URL')
  const today = new Date().toISOString().slice(0, 10)

  const body = urls
    .map((url) => {
      if (!withMeta) return `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`
      return [
        '  <url>',
        `    <loc>${escapeXml(url)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`
}

function apply(text: string, op: string): string {
  if (op === 'urlset') return urlsOf(text).join('\n')
  return build(text, op === 'withMeta')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'https://example.com/\nhttps://example.com/about\n/blog/hello',
  note: '一行一个 URL；相对路径会原样保留，裸域名自动补 https://',
  inputLabel: 'URL 列表',
  outputLabel: 'sitemap.xml',
  noChain: true,
}

export default logic
