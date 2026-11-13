#!/usr/bin/env node
/**
 * 预渲染：把文章页与专题页写成静态 HTML，塞进 dist/guides/<slug>/index.html 和 dist/topics/<id>/index.html。
 *
 * 目的：hash 路由改 history 后，每个页面都有独立地址；但 SPA 首屏 HTML 是空壳，
 * 搜索引擎与 AdSense 审核拿不到正文。这里把正文直接写进 HTML，JS 加载后 Vue 会接管同一个位置。
 *
 * 数据来源：node_modules/.cache/ztools/content.json（由 dump-content.mjs 用 rolldown 编译产出）。
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { marked } from 'marked'

const DIST = 'dist'
const SHELL = join(DIST, 'index.html')
const CONTENT = 'node_modules/.cache/ztools/content.json'
const SITE = (process.env.VITE_SITE_URL ?? 'https://ztools.lxzt.fun').replace(/\/+$/, '')
const BRAND = 'ZT 工具箱'

if (!existsSync(SHELL)) {
  console.error('✗ 找不到 dist/index.html，先跑 vite build')
  process.exit(1)
}
if (!existsSync(CONTENT)) {
  console.error('✗ 找不到内容数据，先跑 node scripts/dump-content.mjs')
  process.exit(1)
}

const shell = readFileSync(SHELL, 'utf8')
const { guides, topics } = JSON.parse(readFileSync(CONTENT, 'utf8'))

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** 工具 id → 标题/简介，专题页要列出来 */
const toolMeta = new Map()
for (const cat of readdirSync('src/tools')) {
  const catDir = join('src/tools', cat)
  if (!statSync(catDir).isDirectory()) continue
  for (const name of readdirSync(catDir)) {
    const metaPath = join(catDir, name, 'meta.ts')
    if (!existsSync(metaPath)) continue
    const src = readFileSync(metaPath, 'utf8')
    const title = /title: '([^']+)'/.exec(src)?.[1] ?? name
    const summary = /summary: '([^']+)'/.exec(src)?.[1] ?? ''
    toolMeta.set(name, { title, summary })
  }
}

const SNAPSHOT_CSS = `<style>
#app>.snap{max-width:820px;margin:0 auto;padding:28px 18px 64px;font:16px/1.75 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1c1e2c}
#app>.snap a{color:#2f6bff;text-decoration:none}
#app>.snap h1{font-size:28px;line-height:1.35;margin:0 0 8px}
#app>.snap h2{font-size:20px;margin:28px 0 10px}
#app>.snap h3{font-size:17px;margin:22px 0 8px}
#app>.snap p{margin:10px 0}
#app>.snap pre{background:#eef1f9;padding:12px 14px;border-radius:10px;overflow:auto}
#app>.snap code{font-family:ui-monospace,Consolas,monospace;font-size:13px}
#app>.snap table{border-collapse:collapse;width:100%;margin:14px 0;font-size:14px}
#app>.snap th,#app>.snap td{border:1px solid #dfe3ee;padding:6px 10px;text-align:left}
#app>.snap ol,#app>.snap ul{padding-left:22px}
#app>.snap .meta{color:#6b7280;font-size:13px}
#app>.snap .tools li{margin:8px 0}
@media (prefers-color-scheme:dark){#app>.snap{color:#e7e9f3}#app>.snap pre{background:#1b1f2a}#app>.snap th,#app>.snap td{border-color:#2d3342}}
</style>`

/** 替换 head 里的标题、描述，并补 canonical 与 og:url */
function withHead(html, { title, description, url }) {
  let out = html
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  out = out.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(description)}" />`)
  out = out.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`)
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${esc(description)}" />`,
  )
  out = out.replace(
    '</head>',
    `    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n${SNAPSHOT_CSS}\n  </head>`,
  )
  return out
}

function withSnapshot(html, block) {
  return html.replace('<div id="app"></div>', `<div id="app">\n${block}\n    </div>`)
}

/**
 * 同时写两种形态：
 *   guides/<slug>/index.html  —— 目录索引，GitHub Pages / EdgeOne 靠它
 *   guides/<slug>.html        —— Cloudflare Workers 默认 html_handling 会把 /guides/<slug> 映射到它
 * 两份内容一致，canonical 统一为不带斜杠的地址。
 */
function writePage(route, html) {
  const dir = join(DIST, route)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html, 'utf8')
  writeFileSync(`${join(DIST, route)}.html`, html, 'utf8')
}

let count = 0

for (const g of guides) {
  const url = `${SITE}/guides/${g.slug}`
  const article = marked.parse(g.body, { async: false })
  const block = `<main class="snap">
      <p class="meta"><a href="/guides">使用指南</a> / ${esc(g.title)}</p>
      <h1>${esc(g.title)}</h1>
      <p class="meta">${esc(g.date)} · ${esc((g.tags ?? []).join(' / '))}</p>
      <article>${article}</article>
      <p class="meta"><a href="/guides">← 全部指南</a></p>
    </main>`
  writePage(`guides/${g.slug}`, withSnapshot(withHead(shell, { title: `${g.title} · ${BRAND}`, description: g.summary, url }), block))
  count += 1
}

for (const t of topics) {
  const url = `${SITE}/topics/${t.id}`
  const paragraphs = String(t.intro ?? '')
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('\n')
  const items = (t.tools ?? [])
    .map((id) => {
      const meta = toolMeta.get(id)
      return `<li><a href="/tools/${id}">${esc(meta?.title ?? id)}</a>${meta?.summary ? ` — ${esc(meta.summary)}` : ''}</li>`
    })
    .join('\n')
  const guideLinks = (t.guides ?? [])
    .map((slug) => {
      const g = guides.find((x) => x.slug === slug)
      return g ? `<li><a href="/guides/${slug}">${esc(g.title)}</a></li>` : ''
    })
    .filter(Boolean)
    .join('\n')

  const block = `<main class="snap">
      <p class="meta"><a href="/topics">专题</a> / ${esc(t.title)}</p>
      <h1>${esc(t.title)}</h1>
      <p class="meta">${esc(t.summary)} · ${(t.tools ?? []).length} 个工具</p>
      ${paragraphs}
      <h2>按顺序使用</h2>
      <ol class="tools">${items}</ol>
      ${guideLinks ? `<h2>相关指南</h2><ul>${guideLinks}</ul>` : ''}
    </main>`
  writePage(`topics/${t.id}`, withSnapshot(withHead(shell, { title: `${t.title} · ${BRAND}`, description: t.summary, url }), block))
  count += 1
}

console.log(`  预渲染完成：${count} 个静态页（guides ${guides.length} / topics ${topics.length}）`)
