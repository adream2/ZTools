#!/usr/bin/env node
/**
 * 工具元数据校验。本项目的工具靠目录约定自动注册，
 * 一旦有人写错 id 或忘声明 networkHosts，只有这个脚本能拦住。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = 'src/tools'
const CATS = new Set(['dev', 'webmaster', 'content', 'calc'])
const KINDS = new Set(['text-op', 'generator', 'lookup', 'calc'])
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const tools = []
for (const cat of readdirSync(ROOT)) {
  const catDir = join(ROOT, cat)
  if (!statSync(catDir).isDirectory() || !CATS.has(cat)) continue
  for (const name of readdirSync(catDir)) {
    const dir = join(catDir, name)
    if (!statSync(dir).isDirectory()) continue
    tools.push({ cat, name, dir })
  }
}

const errors = []
const ids = new Map()

function pick(src, key) {
  const m = new RegExp(`${key}:\\s*'([^']*)'`).exec(src)
  return m?.[1]
}

for (const t of tools) {
  const metaPath = join(t.dir, 'meta.ts')
  const rel = relative('.', metaPath)
  if (!existsSync(metaPath)) {
    errors.push(`${rel} 不存在`)
    continue
  }
  const src = readFileSync(metaPath, 'utf8')

  const id = pick(src, 'id')
  const title = pick(src, 'title')
  const summary = pick(src, 'summary')
  const category = pick(src, 'category')
  const kind = pick(src, 'kind')
  const privacy = pick(src, 'privacy')
  const keywordsRaw = /keywords:\s*\[([\s\S]*?)\]/.exec(src)?.[1] ?? ''
  const keywords = keywordsRaw.split(',').filter((k) => k.trim().length > 2).length

  if (!id) errors.push(`${rel} 缺少 id`)
  else {
    if (ids.has(id)) errors.push(`${rel} id「${id}」与 ${ids.get(id)} 重复`)
    ids.set(id, rel)
    if (!KEBAB.test(id)) errors.push(`${rel} id「${id}」不是 kebab-case`)
    if (id !== t.name) errors.push(`${rel} id「${id}」与目录名「${t.name}」不一致`)
  }

  if (!title) errors.push(`${rel} 缺少 title`)
  if (!summary) errors.push(`${rel} 缺少 summary`)
  else if ([...summary].length > 34) errors.push(`${rel} summary 超过 34 字（${[...summary].length}）`)

  if (category !== t.cat) errors.push(`${rel} category「${category}」与目录「${t.cat}」不一致`)
  if (keywords < 4) errors.push(`${rel} keywords 少于 4 个`)

  if (kind && !KINDS.has(kind)) errors.push(`${rel} 未知 kind「${kind}」`)

  if (privacy === 'network' && !/networkHosts:\s*\[/.test(src)) {
    errors.push(`${rel} privacy=network 但没声明 networkHosts`)
  }

  // 有 kind 必须有 logic.ts；没有 kind 必须有 Tool.vue
  if (kind) {
    if (!existsSync(join(t.dir, 'logic.ts'))) errors.push(`${rel} kind=${kind} 但缺少 logic.ts`)
  } else if (!existsSync(join(t.dir, 'Tool.vue'))) {
    errors.push(`${rel} 既没有 Tool.vue，也没声明 kind`)
  }

  // 元数据里不该出现网络请求（fetch 只能写在 logic/Tool 里）
  if (/fetch\(/.test(src)) errors.push(`${rel} 元数据里出现 fetch，请移到 logic.ts`)
}

const byCat = {}
for (const t of tools) byCat[t.cat] = (byCat[t.cat] ?? 0) + 1

console.log(`  工具总数 ${tools.length}：`, Object.entries(byCat).map(([k, v]) => `${k} ${v}`).join(' / '))

if (errors.length) {
  console.error(`\n✗ 工具元数据校验失败（${errors.length} 项）：`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log('✓ 工具元数据校验通过')
