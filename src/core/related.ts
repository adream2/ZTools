import { VISIBLE_TOOLS, getTool } from './registry'
import type { ToolDefinition } from './types'
import { topicsOfTool } from '@/content/topics'

/**
 * 相似工具推荐：用于没有归属专题的工具。
 * 打分顺序：同子类 > 同分类 > 共享关键词数量。
 */
export function similarTools(id: string, limit = 6): ToolDefinition[] {
  const tool = getTool(id)
  if (!tool) return []

  const keywords = new Set(tool.meta.keywords.map((k) => k.toLowerCase()))
  const scored: Array<{ tool: ToolDefinition; score: number }> = []

  for (const other of VISIBLE_TOOLS) {
    if (other.meta.id === id) continue

    let score = 0
    if (tool.meta.subcategory && other.meta.subcategory === tool.meta.subcategory) score += 5
    if (other.meta.category === tool.meta.category) score += 2

    const shared = other.meta.keywords.filter((k) => keywords.has(k.toLowerCase())).length
    score += Math.min(3, shared) * 2

    if (score > 0) scored.push({ tool: other, score })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.tool.meta.title.localeCompare(b.tool.meta.title, 'zh'))
    .slice(0, limit)
    .map((x) => x.tool)
}

/** 该工具是否已经在某个专题里（专题区块会接管推荐位） */
export function inAnyTopic(id: string): boolean {
  return topicsOfTool(id).length > 0
}
