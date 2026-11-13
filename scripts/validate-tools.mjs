#!/usr/bin/env node
/**
 * 工具元数据校验。本项目的工具靠目录约定自动注册，
 * 一旦有人写错 id 或忘声明 networkHosts，只有这个脚本能拦住。
 *
 * 分类白名单不再手写：直接读 src/core/categories.ts，新增分类只需改那一个文件。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = 'src/tools'
const CATEGORY_FILE = 'src/core/categories.ts'
const KINDS = new Set(['text-op', 'generator', 'lookup', 'calc', 'file-op'])
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

if (!existsSync(CATEGORY_FILE)) {
  console.error(`✗ 找不到分类定义 ${CATEGORY_FILE}`)
  process.exit(1)
}

/** 从 categories.ts 里抽 { id, title }，与运行时同一份数据 */
const catSrc = readFileSync(CATEGORY_FILE, 'utf8')
const categories = [...catSrc.matchAll(/id:\s*'([a-z0-9-]+)',\s*\n\s*title:\s*'([^']+)'/g)].map((m) => ({
  id: m[1],
  title: m[2],
}))
const CATS = new Set(categories.map((c) => c.id))

if (!CATS.size) {
  console.error('✗ 没能从 categories.ts 解析出分类，检查一下文件结构')
  process.exit(1)
}

const tools = []
for (const cat of readdirSync(ROOT)) {
  const catDir = join(ROOT, cat)
  if (!statSync(catDir).isDirectory()) continue
  if (!CATS.has(cat)) {
    // 目录存在但分类没登记：registry 会把工具丢掉，这里必须报错
    continue
  }
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

  if (!category) errors.push(`${rel} 缺少 category`)
  else if (!CATS.has(category)) {
    errors.push(`${rel} category「${category}」未在 src/core/categories.ts 登记`)
  } else if (category !== t.cat) {
    errors.push(`${rel} category「${category}」与目录「${t.cat}」不一致`)
  }
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

// 未登记的目录：会被 registry 静默跳过，必须提示
for (const entry of readdirSync(ROOT)) {
  const dir = join(ROOT, entry)
  if (!statSync(dir).isDirectory()) continue
  if (!CATS.has(entry)) errors.push(`src/tools/${entry} 不是已登记的分类（见 src/core/categories.ts）`)
}

// 专题引用校验：topics.ts 里的工具 id 与指南 slug 必须真实存在
const TOPIC_FILE = 'src/content/topics.ts'
const GUIDE_FILE = 'src/content/guides.ts'
if (existsSync(TOPIC_FILE)) {
  const topicSrc = readFileSync(TOPIC_FILE, 'utf8')
  const ids = new Set(tools.map((t) => t.name))
  for (const block of topicSrc.matchAll(/tools:\s*\[([\s\S]*?)\]/g)) {
    for (const m of block[1].matchAll(/'([a-z0-9-]+)'/g)) {
      if (!ids.has(m[1])) errors.push(`专题引用了不存在的工具 id：${m[1]}`)
    }
  }
  if (existsSync(GUIDE_FILE)) {
    const guideSrc = readFileSync(GUIDE_FILE, 'utf8')
    const slugs = new Set([...guideSrc.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]))
    for (const block of topicSrc.matchAll(/guides:\s*\[([\s\S]*?)\]/g)) {
      for (const m of block[1].matchAll(/'([a-z0-9-]+)'/g)) {
        if (!slugs.has(m[1])) errors.push(`专题引用了不存在的指南 slug：${m[1]}`)
      }
    }
  }
}

const byCat = {}
for (const t of tools) byCat[t.cat] = (byCat[t.cat] ?? 0) + 1

for (const c of categories) {
  if (!byCat[c.id]) errors.push(`分类「${c.title}」(${c.id}) 一个工具都没有，请补工具或从 categories.ts 删掉`)
}

console.log(
  `  工具总数 ${tools.length}：`,
  categories.map((c) => `${c.title} ${byCat[c.id] ?? 0}`).join(' / '),
)

if (errors.length) {
  console.error(`\n✗ 工具元数据校验失败（${errors.length} 项）：`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log('✓ 工具元数据校验通过')
