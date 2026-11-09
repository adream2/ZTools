#!/usr/bin/env node
/**
 * 浏览器巡检：把每个工具页都打开一遍，检查标题、横向溢出与 console 错误。
 * 依赖本机 Edge/Chrome（playwright-core 只做驱动，不下载浏览器）。
 *
 * 用法：先 npm run build && npm run preview，再 node scripts/check-tools.mjs [baseUrl]
 */
import { chromium } from 'playwright-core'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://localhost:4173/'
const CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

const exe = CANDIDATES.find((p) => {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
})
if (!exe) {
  console.error('✗ 找不到本机浏览器，无法巡检')
  process.exit(1)
}

const tools = []
for (const cat of readdirSync('src/tools')) {
  const dir = join('src/tools', cat)
  if (!statSync(dir).isDirectory()) continue
  for (const name of readdirSync(dir)) {
    if (!statSync(join(dir, name)).isDirectory()) continue
    const meta = readFileSync(join(dir, name, 'meta.ts'), 'utf8')
    if (/hidden:\s*true/.test(meta)) continue
    tools.push({ id: name, title: /title:\s*'([^']+)'/.exec(meta)?.[1] ?? '' })
  }
}

const browser = await chromium.launch({ executablePath: exe, headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)

let ok = 0
const fails = []
for (const t of tools) {
  const before = errors.length
  await page.goto(`${BASE}#/tools/${t.id}`, { waitUntil: 'commit' })
  try {
    await page.waitForFunction(
      (expect) => document.querySelector('h1')?.textContent?.trim() === expect,
      t.title,
      { timeout: 6000 },
    )
  } catch {
    fails.push(`${t.id} 未渲染出标题「${t.title}」`)
    continue
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
  if (overflow) fails.push(`${t.id} 横向溢出`)
  const extra = errors.length - before
  if (extra) fails.push(`${t.id} 有 ${extra} 条 console 错误`)
  else ok++
}

console.log(`工具 ${tools.length} 个，通过 ${ok}，问题 ${fails.length}`)
for (const f of fails) console.log('  ✗', f)
for (const e of errors.slice(0, 5)) console.log('  console:', e.slice(0, 160))

await browser.close()
process.exit(fails.length ? 1 : 0)
