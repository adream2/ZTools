#!/usr/bin/env node
/**
 * 把工具页里「描边 + 圆角 + overflow」的老容器换成黏土语义（内凹或浮起）。
 * 只处理 <style> 里深度为 1 的规则块，跳过 @media 内的嵌套。
 *
 * 用法：
 *   node scripts/codemod-clay.mjs          # 预览
 *   node scripts/codemod-clay.mjs --write  # 落盘
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const WRITE = process.argv.includes('--write')
const ROOT = 'src/tools'
const BACKUP = '.tmp/clay-backup'

const INSET_HINT = /(list|table|out|rows|runs|values|matches|claims|zones|pairs|groups|file|box|block|upload|swatches|img)$/
const RAISED_HINT = /^\.?(card|stats|hero|panel)$/

const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full)
    else if (name === 'Tool.vue') files.push(full)
  }
}
walk(ROOT)

const changes = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const styleMatch = /<style[^>]*>([\s\S]*?)<\/style>/.exec(src)
  if (!styleMatch) continue

  const css = styleMatch[1]
  let out = ''
  let i = 0
  let changed = false

  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open === -1) {
      out += css.slice(i)
      break
    }
    // 找到匹配的 }
    let depth = 0
    let close = -1
    for (let j = open; j < css.length; j++) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') {
        depth--
        if (depth === 0) {
          close = j
          break
        }
      }
    }
    if (close === -1) {
      out += css.slice(i)
      break
    }

    const selector = css.slice(i, open)
    const body = css.slice(open + 1, close)

    // 只处理顶层、非 @media / @keyframes 的块，且不含嵌套块
    const isTopLevel = !selector.includes('@') && !body.includes('{')
    const hasBorder = /border:\s*1px\s+solid\s+var\(--c-border\)\s*;?/.test(body)
    const hasRadius = /border-radius:\s*var\(--radius-(sm|md)\)/.test(body)
    const hasOverflow = /overflow:\s*hidden/.test(body)

    if (isTopLevel && hasBorder && hasRadius && hasOverflow) {
      const cls = selector.trim().split(/[\s,:]/).pop() ?? ''
      const tone = RAISED_HINT.test(cls) ? 'raised' : INSET_HINT.test(cls) ? 'inset' : 'inset'

      let next = body
        .replace(/\n?\s*border:\s*1px\s+solid\s+var\(--c-border\)\s*;?/, '')
        .replace(/border-radius:\s*var\(--radius-sm\)/, 'border-radius: var(--radius-container-sm)')
        .replace(/border-radius:\s*var\(--radius-md\)/, 'border-radius: var(--radius-container-md)')

      const shadow = tone === 'raised' ? 'var(--clay-raised-sm)' : 'var(--clay-inset)'
      if (!/box-shadow/.test(next)) {
        next = next.replace(/(\{?\s*)$/, `  box-shadow: ${shadow};\n`)
        // 插到声明末尾
        next = body
          .replace(/\n?\s*border:\s*1px\s+solid\s+var\(--c-border\)\s*;?/, '')
          .replace(/border-radius:\s*var\(--radius-sm\)/, 'border-radius: var(--radius-container-sm)')
          .replace(/border-radius:\s*var\(--radius-md\)/, 'border-radius: var(--radius-container-md)')
          .trimEnd()
        next = `${next}\n  box-shadow: ${shadow};`
      }
      if (!/background/.test(next)) {
        next = next.trimEnd()
        next = `${next}\n  background: var(--c-surface);`
      }
      if (!next.endsWith('\n')) next += '\n'

      out += `${selector}{${next}`
      out += '}'
      changed = true
      changes.push(`${relative('.', file)}  ${selector.trim()}  → ${tone}`)
      i = close + 1
      continue
    }

    out += css.slice(i, close + 1)
    i = close + 1
  }

  if (changed && WRITE) {
    mkdirSync(BACKUP, { recursive: true })
    const backupPath = join(BACKUP, relative(ROOT, file).replace(/[\\/]/g, '__'))
    copyFileSync(file, backupPath)
    writeFileSync(file, src.replace(styleMatch[1], out), 'utf8')
  }
}

console.log(`扫描 ${files.length} 个 Tool.vue，命中 ${changes.length} 处容器`)
for (const c of changes) console.log('  ·', c)
if (!WRITE) console.log('\n（预览模式，加 --write 落盘；原件会备份到 .tmp/clay-backup）')
