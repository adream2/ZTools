#!/usr/bin/env node
/**
 * 站点文案数量校验。
 *
 * 工具数、分类数、本地/联网数散落在 index.html、llms.txt、README 里，
 * 全靠手写必然漂移（历史上 llms.txt 就同时写着「3 个」和「5 个」联网工具）。
 * 这里把它们逐处跟 src/tools 的真实情况对齐，不一致就构建失败。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src/tools'
const CATEGORY_FILE = 'src/core/categories.ts'

const catSrc = readFileSync(CATEGORY_FILE, 'utf8')
const categories = [...catSrc.matchAll(/id:\s*'([a-z0-9-]+)',\s*\n\s*title:\s*'([^']+)'/g)].map((m) => ({
  id: m[1],
  title: m[2],
}))

const per = Object.fromEntries(categories.map((c) => [c.id, 0]))
let total = 0
let network = 0

for (const cat of readdirSync(ROOT)) {
  const dir = join(ROOT, cat)
  if (!statSync(dir).isDirectory()) continue
  for (const name of readdirSync(dir)) {
    const meta = join(dir, name, 'meta.ts')
    if (!existsSync(meta)) continue
    const src = readFileSync(meta, 'utf8')
    if (/hidden:\s*true/.test(src)) continue
    total += 1
    per[cat] = (per[cat] ?? 0) + 1
    if (/privacy:\s*'network'/.test(src)) network += 1
  }
}
const local = total - network

const guideSrc = readFileSync('src/content/guides.ts', 'utf8')
const guides = (guideSrc.match(/\n\s+slug: '/g) ?? []).length

const problems = []
const notes = []

function check(label, actual, expected) {
  if (actual === undefined) problems.push(`${label}：文案里找不到对应数字，可能被删改`)
  else if (actual !== expected) problems.push(`${label}：文案写 ${actual}，实际 ${expected}`)
}

function nums(src, re) {
  return [...src.matchAll(re)].map((m) => Number(m[1]))
}

function each(label, list, expected) {
  if (!list.length) problems.push(`${label}：一处都没找到，检查文案是否被改写`)
  for (const n of list) check(label, n, expected)
}

// ---------- index.html ----------
const html = readFileSync('index.html', 'utf8')

each('index.html「N 个工具」', nums(html, /(\d+)\s*个工具(?!需要访问外部接口)/g), total)
each('index.html「N 篇原创教程」', nums(html, /(\d+)\s*篇原创教程/g), guides)

const localSentence = /(\d+)\s*个工具中\s*(\d+)\s*个完全在本地运行/.exec(html)
if (localSentence) {
  check('index.html 本地工具数', Number(localSentence[2]), local)
} else {
  problems.push('index.html：找不到「N 个工具中 M 个完全在本地运行」')
}

const netSentence = /等\s*(\d+)\s*个工具需要访问外部接口/.exec(html)
if (netSentence) check('index.html 联网工具数', Number(netSentence[1]), network)
else problems.push('index.html：找不到「等 N 个工具需要访问外部接口」')

for (const c of categories) {
  const m = new RegExp(`${c.title}（(\\d+) 个）`).exec(html)
  if (!m) problems.push(`index.html：找不到分类「${c.title}（N 个）」`)
  else check(`index.html「${c.title}」`, Number(m[1]), per[c.id] ?? 0)
}

// ---------- public/llms.txt ----------
const llms = readFileSync('public/llms.txt', 'utf8')
const kv = (label) => {
  const m = new RegExp(`${label}：(\\d+)`).exec(llms)
  return m ? Number(m[1]) : undefined
}
check('llms.txt 工具总数', kv('工具总数'), total)
check('llms.txt 纯本地工具', kv('纯本地工具'), local)
check('llms.txt 需要联网的工具', kv('需要联网的工具'), network)

const otherNet = /另外\s*(\d+)\s*个/.exec(llms)
if (otherNet) check('llms.txt「另外 N 个」', Number(otherNet[1]), network)
else problems.push('llms.txt：找不到「另外 N 个（联网工具）」')

for (const c of categories) {
  const m = new RegExp(`##+ ${c.title}（(\\d+) 个）`).exec(llms)
  if (!m) problems.push(`llms.txt：找不到分类「${c.title}（N 个）」`)
  else check(`llms.txt「${c.title}」`, Number(m[1]), per[c.id] ?? 0)
}

const linked = (llms.match(/\]\(\/tools\/[a-z0-9-]+\)/g) ?? []).length
check('llms.txt 工具链接条数', linked, total)
notes.push(`llms.txt 收录 ${linked} 个工具链接`)

const articleSentence = /原创文章：(\d+)\s*篇/.exec(llms)
if (articleSentence) check('llms.txt 原创文章数', Number(articleSentence[1]), guides)
else problems.push('llms.txt：找不到「原创文章：N 篇」')

// ---------- README.md ----------
const readme = readFileSync('README.md', 'utf8')
for (const c of categories) {
  const m = new RegExp(`\\|\\s*${c.title}\\s*\\|\\s*(\\d+)\\s*\\|`).exec(readme)
  if (!m) problems.push(`README 工具分布表：找不到「${c.title}」行`)
  else check(`README「${c.title}」`, Number(m[1]), per[c.id] ?? 0)
}
const totalRow = /\|\s*\*\*合计\*\*\s*\|\s*\*\*(\d+)\*\*/.exec(readme)
if (totalRow) check('README 合计', Number(totalRow[1]), total)
else problems.push('README 工具分布表：找不到「**合计**」行')

console.log(
  `  文案基准：${total} 个工具（本地 ${local} / 联网 ${network}）· ${categories.length} 个分类 · ${guides} 篇教程`,
)
for (const n of notes) console.log(`  - ${n}`)

if (problems.length) {
  console.error(`\n✗ 站点文案与真实工具数不一致（${problems.length} 项）：`)
  for (const p of problems) console.error(`  - ${p}`)
  console.error('\n  改完 index.html / llms.txt / README 后重跑即可')
  process.exit(1)
}
console.log('✓ 站点文案数量校验通过')
