#!/usr/bin/env node
/**
 * 构建产物校验：base 是唯一真相来源，这里断言所有派生路径都跟它对齐。
 * GitHub Pages 子路径部署最常见的白屏原因就是这里不一致。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function normalizeBase(raw) {
  const v = (raw ?? '').trim()
  if (!v || v === '/') return '/'
  const withLead = v.startsWith('/') ? v : `/${v}`
  return withLead.endsWith('/') ? withLead : `${withLead}/`
}

const base = normalizeBase(process.env.VITE_BASE)
const dist = 'dist'
const problems = []
const notes = []

function fail(msg) {
  problems.push(msg)
}

if (!existsSync(dist)) {
  console.error('✗ dist 不存在，请先运行 npm run build')
  process.exit(1)
}

// 1. index.html 资源前缀
const indexPath = join(dist, 'index.html')
if (!existsSync(indexPath)) {
  fail('dist/index.html 缺失')
} else {
  const html = readFileSync(indexPath, 'utf8')
  const assetRefs = [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((m) => m[1])
  if (!assetRefs.length) fail('index.html 中找不到 assets 引用')
  for (const ref of assetRefs) {
    if (!ref.startsWith(base)) fail(`资源路径未带 base：${ref}（期望以 ${base} 开头）`)
  }

  const iconRefs = [...html.matchAll(/(?:src|href)="([^"]*\.(?:svg|png|ico))"/g)].map((m) => m[1])
  for (const ref of iconRefs) {
    if (!ref.startsWith(base) && !ref.startsWith('data:')) fail(`图标路径未带 base：${ref}`)
  }
  notes.push(`index.html 引用 ${assetRefs.length} 个 assets，前缀均为 ${base}`)
}

// 2. Service Worker
if (!existsSync(join(dist, 'sw.js'))) fail('dist/sw.js 缺失，PWA 未生成')
else notes.push('sw.js 已生成')

// 3. manifest
const manifestPath = join(dist, 'manifest.webmanifest')
if (!existsSync(manifestPath)) {
  fail('manifest.webmanifest 缺失')
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (manifest.start_url !== base) fail(`manifest.start_url = ${manifest.start_url}，应为 ${base}`)
  if (manifest.scope !== base) fail(`manifest.scope = ${manifest.scope}，应为 ${base}`)
  if (manifest.id !== base) fail(`manifest.id = ${manifest.id}，应为 ${base}`)

  for (const icon of manifest.icons ?? []) {
    const rel = icon.src.replace(base, '')
    if (!existsSync(join(dist, rel))) fail(`manifest 引用的图标不存在：${icon.src}`)
  }
  notes.push(`manifest scope/start_url/id 均为 ${base}，图标 ${(manifest.icons ?? []).length} 个`)
}

// 4. 资源体积预算
const assetsDir = join(dist, 'assets')
if (existsSync(assetsDir)) {
  const files = readdirSync(assetsDir)
  const entryJs = files.filter((f) => /^index-.*\.js$/.test(f))
  const totalKb = entryJs.reduce((n, f) => n + readFileSync(join(assetsDir, f)).length, 0) / 1024
  notes.push(`入口 JS ${entryJs.join(', ') || '无'} 共 ${totalKb.toFixed(1)} KB（未压缩）`)
  if (totalKb > 400) fail(`入口 JS 超过 400 KB 预算：${totalKb.toFixed(1)} KB`)
}

// 5. SEO 产物：sitemap / 404 回退 / 预渲染文章
const sitemapPath = join(dist, 'sitemap.xml')
if (!existsSync(sitemapPath)) {
  fail('dist/sitemap.xml 缺失，History 路由下搜索引擎找不到内页')
} else {
  const xml = readFileSync(sitemapPath, 'utf8')
  const urls = (xml.match(/<loc>/g) ?? []).length
  if (urls < 200) fail(`sitemap 只有 ${urls} 条，明显少于工具数量`)
  notes.push(`sitemap.xml ${urls} 条 URL`)
}

const notFoundPath = join(dist, '404.html')
if (!existsSync(notFoundPath)) fail('dist/404.html 缺失，GitHub Pages / EdgeOne 深链会 404')
else notes.push('404.html 已生成（SPA 回退）')

const guidesDir = join(dist, 'guides')
if (!existsSync(guidesDir)) {
  fail('dist/guides 缺失，文章页未预渲染')
} else {
  const slugs = readdirSync(guidesDir).filter((name) => statSync(join(guidesDir, name)).isDirectory())
  const sample = slugs[0]
  const sampleFile = sample ? join(guidesDir, sample, 'index.html') : ''
  if (!sampleFile || !existsSync(sampleFile)) {
    fail('预渲染文章页缺失（dist/guides/<slug>/index.html）')
  } else {
    const html = readFileSync(sampleFile, 'utf8')
    if (!html.includes('<article')) fail('预渲染文章页里没有 <article>，正文没写进去')
    if (!html.includes('rel="canonical"')) fail('预渲染文章页缺少 canonical')
    notes.push(`预渲染文章 ${slugs.length} 篇，示例 ${sample}`)
  }
}

for (const n of notes) console.log(`  · ${n}`)

if (problems.length) {
  console.error(`\n✗ 构建产物校验失败（${problems.length} 项）：`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

console.log(`\n✓ 构建产物校验通过（base = ${base}）`)
