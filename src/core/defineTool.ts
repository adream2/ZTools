import type { ToolMeta } from './types'

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * 定义工具元数据。只做类型收敛与开发期校验，
 * 保证 `import.meta.glob` 拿到的 meta 一定符合 ToolMeta。
 */
export function defineTool(meta: ToolMeta): ToolMeta {
  if (import.meta.env.DEV) {
    const problems: string[] = []
    if (!KEBAB.test(meta.id)) problems.push(`id 必须是 kebab-case：${meta.id}`)
    if (!meta.title?.trim()) problems.push('title 不能为空')
    if (!meta.summary?.trim()) problems.push('summary 不能为空')
    if (!meta.keywords?.length) problems.push('keywords 至少一个')
    if (meta.privacy === 'network' && !meta.networkHosts?.length) {
      problems.push('privacy=network 时必须声明 networkHosts')
    }
    if (problems.length) {
      console.error(`[tool:${meta.id}] ${problems.join('；')}`)
    }
  }
  return meta
}
