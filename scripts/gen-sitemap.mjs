#!/usr/bin/env node
/**
 * 构建后处理：
 * 1. 生成 dist/sitemap.xml（工具 / 文章 / 专题 / 静态页）
 * 2. 复制 dist/index.html 为 dist/404.html，给 GitHub Pages / EdgeOne 做 SPA 回退
 * 3. 校正 dist/robots.txt 里的 Sitemap 地址
 *
 * 站点域名可用 VITE_SITE_URL 覆盖，默认 ztools.lxzt.fun。
 */
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const SITE = (process.env.VITE_SITE_URL ?? 'https://ztools.lxzt.fun').replace(/\/+$/, '')
const TODAY = new Date().toISOString().slice(0, 10)

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('✗ 找不到 dist/index.html，先跑 vite build')
  process.exit(1)
}

/** 工具 id 就是目录名；分类目录下再套一层工具目录 */
function collectTools() {
  const out = []
  for (const cat of readdirSync('src/tools')) {
    const catDir = join('src/tools', cat)
    if (!statSync(catDir).isDirectory()) continue
    for (const name of readdirSync(catDir)) {
      const metaPath = join(catDir, name, 'meta.ts')
      if (!existsSync(metaPath)) continue
      out.push({ id: name, cat })
    }
  }
  return out
}

const guideSrc = readFileSync('src/content/guides.ts', 'utf8')
const guides = [...guideSrc.matchAll(/slug: '([a-z0-9-]+)',\s*\n\s*title: '([^']+)',[\s\S]*?date: '(\d{4}-\d{2}-\d{2})'/g)].map(
  (m) => ({ slug: m[1], date: m[3] }),
)

const topicSrc = readFileSync('src/content/topics.ts', 'utf8')
const topics = [...topicSrc.matchAll(/^\s{4}id: '([a-z0-9-]+)',/gm)].map((m) => m[1])

const tools = collectTools()

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: TODAY },
  { loc: '/topics', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { loc: '/guides', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  ...topics.map((id) => ({ loc: `/topics/${id}`, priority: '0.7', changefreq: 'monthly', lastmod: TODAY })),
  ...guides.map((g) => ({ loc: `/guides/${g.slug}`, priority: '0.7', changefreq: 'monthly', lastmod: g.date })),
  ...tools.map((t) => ({ loc: `/tools/${t.id}`, priority: '0.6', changefreq: 'monthly', lastmod: TODAY })),
  ...['/about', '/contact', '/privacy', '/terms'].map((loc) => ({
    loc,
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: TODAY,
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf8')

// SPA 回退：GitHub Pages 与 EdgeOne Pages 都认 404.html
copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'))

// robots.txt 补 Sitemap 行
const robotsPath = join(DIST, 'robots.txt')
if (existsSync(robotsPath)) {
  const body = readFileSync(robotsPath, 'utf8')
  if (!body.includes('Sitemap:')) {
    writeFileSync(robotsPath, `${body.trimEnd()}\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8')
  }
}

console.log(`  sitemap.xml 已生成：${urls.length} 条（${tools.length} 工具 / ${guides.length} 文章 / ${topics.length} 专题）`)
console.log('  404.html 已生成（SPA 回退）')
