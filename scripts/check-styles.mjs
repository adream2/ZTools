#!/usr/bin/env node
/**
 * 样式回潮检查：新工具不许再手写裸色值，也不许自己拼「描边+圆角+overflow」容器。
 * 挂进 npm run verify，防止 93 个新工具把设计系统冲垮。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full)
    else if (name === 'Tool.vue') files.push(full)
  }
}
walk('src/tools')

// 天然需要自有边框/裁切的工具，允许例外
const WHITELIST = new Set([
  'image-crop',
  'svg-preview',
  'markdown',
  'color',
  'qrcode',
  'text-diff',
  'image-compress',
  'image-collage',
])

const errors = []
const warnings = []

const NAKED_COLOR = /(?<!var\(--[^)]*)\b(#[0-9a-fA-F]{3,8})\b/g

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const styleMatch = /<style[^>]*>([\s\S]*?)<\/style>/.exec(src)
  if (!styleMatch) continue
  const css = styleMatch[1]
  const id = file.split(/[\\/]/).slice(-2)[0]
  const rel = relative('.', file)

  // 1. 裸色值（排除 data URI 与注释）
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '')
  for (const m of cleaned.matchAll(NAKED_COLOR)) {
    const value = m[1].toLowerCase()
    // 纯白/纯黑在图片预览、画布、遮罩里是合理的
    if (value === '#fff' || value === '#ffffff' || value === '#000' || value === '#000000') {
      if (!WHITELIST.has(id)) warnings.push(`${rel} 裸色值 ${m[1]}`)
      continue
    }
    errors.push(`${rel} 裸色值 ${m[1]}`)
  }

  // 2. 三连容器回归
  if (!WHITELIST.has(id)) {
    const blocks = cleaned.matchAll(/([^{}]+)\{([^{}]*)\}/g)
    for (const b of blocks) {
      const body = b[2]
      const triple =
        /border:\s*1px\s+solid/.test(body) && /border-radius/.test(body) && /overflow:\s*hidden/.test(body)
      if (triple) {
        errors.push(`${rel}  ${b[1].trim()} 仍是「描边+圆角+overflow」，请改用 .clay-list / .clay-table`)
      }
    }
  }

  // 3. 字面量圆角
  for (const m of cleaned.matchAll(/border-radius:\s*(\d+)px/g)) {
    const px = Number(m[1])
    if (px > 4 && px !== 50) warnings.push(`${rel} 字面量圆角 ${px}px`)
  }
}

for (const w of warnings) console.log(`  ! ${w}`)
if (errors.length) {
  console.error(`\n✗ 样式检查失败（${errors.length} 项）：`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`\n✓ 样式检查通过（${files.length} 个工具，${warnings.length} 条提示）`)
