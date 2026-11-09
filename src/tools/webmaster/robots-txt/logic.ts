export type RuleKind = 'allow' | 'disallow'

export interface RobotsRule {
  kind: RuleKind
  path: string
}

export interface RobotsGroup {
  agent: string
  rules: RobotsRule[]
  crawlDelay: string
}

export interface RobotsConfig {
  groups: RobotsGroup[]
  sitemaps: string[]
}

export function emptyConfig(): RobotsConfig {
  return {
    groups: [{ agent: '*', rules: [{ kind: 'disallow', path: '' }], crawlDelay: '' }],
    sitemaps: [],
  }
}

export function buildRobots(config: RobotsConfig): string {
  const blocks: string[] = []

  for (const group of config.groups) {
    const agent = group.agent.trim() || '*'
    const lines = [`User-agent: ${agent}`]
    for (const rule of group.rules) {
      const path = rule.path.trim()
      if (!path) continue
      lines.push(`${rule.kind === 'allow' ? 'Allow' : 'Disallow'}: ${path.startsWith('/') ? path : `/${path}`}`)
    }
    if (group.crawlDelay.trim()) lines.push(`Crawl-delay: ${group.crawlDelay.trim()}`)
    if (lines.length === 1) lines.push('Disallow:')
    blocks.push(lines.join('\n'))
  }

  if (config.sitemaps.length) {
    blocks.push(config.sitemaps.filter(Boolean).map((s) => `Sitemap: ${s.trim()}`).join('\n'))
  }

  return `${blocks.join('\n\n')}\n`
}

export function parseRobots(text: string): RobotsConfig {
  const config = emptyConfig()
  const groups: RobotsGroup[] = []
  let current: RobotsGroup | null = null
  let lastWasAgent = false

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim()
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim().toLowerCase()
    const value = line.slice(idx + 1).trim()

    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agent: value || '*', rules: [], crawlDelay: '' }
        groups.push(current)
      } else {
        current.agent = `${current.agent}, ${value}`
      }
      lastWasAgent = true
      continue
    }

    lastWasAgent = false

    if (key === 'sitemap') {
      config.sitemaps.push(value)
      continue
    }

    if (!current) {
      current = { agent: '*', rules: [], crawlDelay: '' }
      groups.push(current)
    }

    if (key === 'allow' || key === 'disallow') {
      current.rules.push({ kind: key, path: value })
    } else if (key === 'crawl-delay') {
      current.crawlDelay = value
    }
  }

  config.groups = groups.length ? groups : emptyConfig().groups
  return config
}

export interface ValidationIssue {
  level: 'error' | 'warn'
  message: string
}

export function validateRobots(config: RobotsConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!config.groups.length) issues.push({ level: 'error', message: '至少需要一个 User-agent 组' })

  for (const group of config.groups) {
    if (!group.agent.trim()) issues.push({ level: 'error', message: 'User-agent 不能为空' })
    if (!group.rules.some((r) => r.path.trim())) {
      issues.push({ level: 'warn', message: `${group.agent || '*'} 组没有任何规则，等同全站允许` })
    }
    for (const rule of group.rules) {
      if (!rule.path.trim()) continue
      if (!rule.path.startsWith('/') && !rule.path.startsWith('*')) {
        issues.push({ level: 'warn', message: `路径建议以 / 开头：${rule.path}` })
      }
    }
    if (group.crawlDelay && !/^\d+$/.test(group.crawlDelay.trim())) {
      issues.push({ level: 'error', message: 'Crawl-delay 必须是整数秒' })
    }
  }

  const hasSitemap = config.sitemaps.some((s) => s.trim())
  if (!hasSitemap) issues.push({ level: 'warn', message: '建议添加 Sitemap，帮助搜索引擎发现页面' })

  for (const sitemap of config.sitemaps) {
    if (!sitemap.trim()) continue
    if (!/^https?:\/\//.test(sitemap.trim())) {
      issues.push({ level: 'warn', message: `Sitemap 建议使用完整地址：${sitemap}` })
    }
  }

  // 全站禁止
  const starAllDisallow = config.groups.some(
    (g) => (g.agent === '*' || g.agent.includes('*')) && g.rules.some((r) => r.kind === 'disallow' && r.path.trim() === '/'),
  )
  if (starAllDisallow) {
    issues.push({ level: 'error', message: 'User-agent: * 下 Disallow: / 会屏蔽全站收录，请确认这是你要的效果' })
  }

  return issues
}

export const PRESETS: { label: string; build: () => RobotsConfig }[] = [
  {
    label: '允许全部',
    build: () => ({ groups: [{ agent: '*', rules: [{ kind: 'disallow', path: '' }], crawlDelay: '' }], sitemaps: ['https://example.com/sitemap.xml'] }),
  },
  {
    label: '屏蔽后台与搜索页',
    build: () => ({
      groups: [
        {
          agent: '*',
          rules: [
            { kind: 'disallow', path: '/admin/' },
            { kind: 'disallow', path: '/api/' },
            { kind: 'disallow', path: '/search' },
            { kind: 'allow', path: '/' },
          ],
          crawlDelay: '',
        },
      ],
      sitemaps: ['https://example.com/sitemap.xml'],
    }),
  },
  {
    label: '屏蔽全部 AI 爬虫',
    build: () => ({
      groups: [
        { agent: 'GPTBot', rules: [{ kind: 'disallow', path: '/' }], crawlDelay: '' },
        { agent: 'ClaudeBot', rules: [{ kind: 'disallow', path: '/' }], crawlDelay: '' },
        { agent: 'CCBot', rules: [{ kind: 'disallow', path: '/' }], crawlDelay: '' },
        { agent: 'Google-Extended', rules: [{ kind: 'disallow', path: '/' }], crawlDelay: '' },
      ],
      sitemaps: [],
    }),
  },
]
