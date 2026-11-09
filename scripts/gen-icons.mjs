#!/usr/bin/env node
/**
 * 用本机 Edge/Chrome 的 headless 截图功能把内联 SVG 渲染成 PWA 图标，
 * 避免为了几个 PNG 引入 sharp / canvas 这类原生依赖。
 *
 * 用法：node scripts/gen-icons.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

const browser = CANDIDATES.find((p) => existsSync(p))
if (!browser) {
  console.error('✗ 找不到 Edge/Chrome，请手动把 192/512/maskable/180 四个 PNG 放到 public/icons/')
  process.exit(1)
}

const GLYPH = `<svg viewBox="0 0 64 64" fill="none" stroke="#ffffff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" style="width:VAR%;height:VAR%">
  <path d="M26 16 50 40"/><path d="M14 32 32 50"/><path d="M38 16h12v12"/><path d="M26 54H14V42"/>
</svg>`

function html(size, glyphPercent) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;width:${size}px;height:${size}px;overflow:hidden;background:#2f6bff}
    body{display:grid;place-items:center}
  </style></head><body>${GLYPH.replaceAll('VAR', String(glyphPercent))}</body></html>`
}

const outDir = resolve('public/icons')
mkdirSync(outDir, { recursive: true })

const jobs = [
  { file: 'pwa-192.png', size: 192, glyph: 56 },
  { file: 'pwa-512.png', size: 512, glyph: 56 },
  { file: 'maskable-512.png', size: 512, glyph: 42 },
  { file: 'apple-touch-icon.png', size: 180, glyph: 56 },
]

const work = join(tmpdir(), `zt-icon-${Date.now()}`)
mkdirSync(work, { recursive: true })

for (const job of jobs) {
  const page = join(work, `${job.file}.html`)
  writeFileSync(page, html(job.size, job.glyph), 'utf8')
  const out = join(outDir, job.file)

  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      `--user-data-dir=${join(work, 'profile')}`,
      `--window-size=${job.size},${job.size}`,
      `--screenshot=${out.replaceAll('\\', '/')}`,
      `--virtual-time-budget=1500`,
      `file:///${page.replaceAll('\\', '/')}`,
    ],
    { stdio: 'ignore' },
  )

  console.log(`  ✓ ${job.file} (${job.size}×${job.size})`)
}

rmSync(work, { recursive: true, force: true })
console.log('\n图标已生成到 public/icons/')
