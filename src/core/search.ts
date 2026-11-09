import { VISIBLE_TOOLS } from './registry'
import type { ToolDefinition } from './types'

export interface SearchHit {
  tool: ToolDefinition
  score: number
}

/**
 * 无依赖的轻量搜索：空格分词后逐项子串匹配，取最小命中权重。
 * title 3 分 > keywords 2 分 > summary 1 分；开头命中额外加权。
 */
export function searchTools(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const tokens = q.split(/\s+/).filter(Boolean)
  const hits: SearchHit[] = []

  for (const tool of VISIBLE_TOOLS) {
    const { title, summary, keywords } = tool.meta
    const t = title.toLowerCase()
    const s = summary.toLowerCase()
    const ks = keywords.map((k) => k.toLowerCase())

    let total = 0
    let matchedAll = true

    for (const token of tokens) {
      let best = 0
      if (t.includes(token)) best = t.startsWith(token) ? 6 : 3
      else if (ks.some((k) => k.includes(token))) best = 2
      else if (s.includes(token)) best = 1

      if (!best) {
        matchedAll = false
        break
      }
      total += best
    }

    if (matchedAll && total > 0) hits.push({ tool, score: total })
  }

  return hits.sort((a, b) => b.score - a.score || a.tool.meta.title.localeCompare(b.tool.meta.title, 'zh')).slice(0, limit)
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
