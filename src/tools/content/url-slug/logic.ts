import { pinyin } from 'pinyin-pro'
import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'pinyin', label: '中文转拼音', group: '生成' },
  { id: 'latin', label: '只保留英数', group: '生成' },
  { id: 'keep', label: '保留中文（仅转义）', group: '生成' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function withPinyin(text: string): string {
  const converted = pinyin(text, { toneType: 'none', type: 'array', nonZh: 'consecutive', separator: ' ' })
  return slugify(converted.join(' '))
}

function apply(text: string, op: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const raw = line.trim()
      if (!raw) return ''
      if (op === 'pinyin') return withPinyin(raw)
      if (op === 'latin') return slugify(raw.replace(/[\u4e00-\u9fa5]/g, ''))
      return encodeURIComponent(slugify(raw))
    })
    .join('\n')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '如何搭建一个 Cloudflare Workers 静态站点\n2026 年最佳在线工具箱推荐',
  note: '一行一个标题；拼音模式会把中文转成无声调拼音',
  inputLabel: '标题',
  outputLabel: 'Slug',
}

export default logic
