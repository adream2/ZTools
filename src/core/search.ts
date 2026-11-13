import { VISIBLE_TOOLS, getTool } from './registry'
import type { ToolDefinition } from './types'
import { TOPICS } from '@/content/topics'
import { GUIDES } from '@/content/guides'
import { categoryTitle } from './categories'

export type SearchKind = 'tool' | 'topic' | 'guide'

export interface SearchHit {
  kind: SearchKind
  id: string
  title: string
  summary: string
  /** 右侧标签：分类名 / 「专题」/「指南」 */
  label: string
  to: string
  score: number
}

/** 命中权重：标题开头 6、标题包含 3、关键词 2、摘要 1 */
function scoreOf(text: string, tokens: string[], summary: string, keywords: string[]): number {
  const t = text.toLowerCase()
  const s = summary.toLowerCase()
  const ks = keywords.map((k) => k.toLowerCase())

  let total = 0
  for (const token of tokens) {
    let best = 0
    if (t.includes(token)) best = t.startsWith(token) ? 6 : 3
    else if (ks.some((k) => k.includes(token))) best = 2
    else if (s.includes(token)) best = 1

    if (!best) return 0
    total += best
  }
  return total
}

const KIND_BONUS: Record<SearchKind, number> = { tool: 0.3, topic: 0.2, guide: 0.1 }

/**
 * 无依赖的轻量搜索：工具、专题、指南统一召回。
 * 工具略优先（同分时排前面），专题与指南次之。
 */
export function searchAll(query: string, limit = 14): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)
  const hits: SearchHit[] = []

  for (const tool of VISIBLE_TOOLS) {
    const { title, summary, keywords } = tool.meta
    const base = scoreOf(title, tokens, summary, keywords)
    if (!base) continue
    hits.push({
      kind: 'tool',
      id: tool.meta.id,
      title,
      summary,
      label: categoryTitle(tool.meta.category),
      to: `/tools/${tool.meta.id}`,
      score: base + KIND_BONUS.tool,
    })
  }

  for (const topic of TOPICS) {
    // 专题的工具名也算关键词，搜「九宫格」能带出图片专题
    const toolTitles = topic.tools.map((id) => getTool(id)?.meta.title ?? '')
    const base = scoreOf(topic.title, tokens, topic.summary, [...toolTitles, topic.title])
    if (!base) continue
    hits.push({
      kind: 'topic',
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      label: '专题',
      to: `/topics/${topic.id}`,
      score: base + KIND_BONUS.topic,
    })
  }

  for (const guide of GUIDES) {
    const base = scoreOf(guide.title, tokens, guide.summary, guide.tags)
    if (!base) continue
    hits.push({
      kind: 'guide',
      id: guide.slug,
      title: guide.title,
      summary: guide.summary,
      label: '指南',
      to: `/guides/${guide.slug}`,
      score: base + KIND_BONUS.guide,
    })
  }

  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh')).slice(0, limit)
}

/** 兼容旧调用：只要工具结果 */
export function searchTools(query: string, limit = 12): ToolDefinition[] {
  return searchAll(query, limit)
    .filter((h) => h.kind === 'tool')
    .map((h) => getTool(h.id))
    .filter((t): t is ToolDefinition => !!t)
}

/** 把命中的 token 包成 <mark>，供命令面板高亮 */
export function highlight(text: string, query: string): string {
  const q = query.trim()
  if (!q) return escapeHtml(text)
  const tokens = q.split(/\s+/).filter(Boolean).map(escapeRegExp)
  if (!tokens.length) return escapeHtml(text)
  const re = new RegExp(`(${tokens.join('|')})`, 'gi')
  return escapeHtml(text).replace(re, '<mark>$1</mark>')
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
