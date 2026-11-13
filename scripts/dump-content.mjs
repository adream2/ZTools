#!/usr/bin/env node
/**
 * 把 guides.ts / topics.ts 编译成 JSON，供 prerender.mjs 使用。
 * 用 rolldown 打包而不是正则解析，避免模板字符串里的转义被吃错。
 */
import { rolldown } from 'rolldown'
import { mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const OUT_DIR = 'node_modules/.cache/ztools'
const OUT_FILE = resolve(OUT_DIR, 'content.mjs')

mkdirSync(OUT_DIR, { recursive: true })

const bundle = await rolldown({
  input: 'scripts/_content-entry.ts',
  platform: 'node',
  logLevel: 'silent',
})

await bundle.write({
  file: OUT_FILE,
  format: 'esm',
})

const mod = await import(pathToFileURL(OUT_FILE).href)
const payload = { guides: mod.GUIDES, topics: mod.TOPICS }
writeFileSync(resolve(OUT_DIR, 'content.json'), JSON.stringify(payload), 'utf8')
console.log(`  内容数据：${payload.guides.length} 篇文章 / ${payload.topics.length} 个专题`)
