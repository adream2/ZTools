import { describe, expect, it } from 'vitest'
import { buildRobots, emptyConfig, parseRobots, validateRobots } from './logic'

describe('robots.txt', () => {
  it('允许全站的写法', () => {
    const text = buildRobots({ groups: [{ agent: '*', rules: [{ kind: 'disallow', path: '' }], crawlDelay: '' }], sitemaps: [] })
    expect(text).toContain('User-agent: *')
    expect(text).toContain('Disallow:')
  })

  it('路径自动补前导斜杠', () => {
    const text = buildRobots({
      groups: [{ agent: '*', rules: [{ kind: 'disallow', path: 'admin/' }], crawlDelay: '' }],
      sitemaps: ['https://a.com/sitemap.xml'],
    })
    expect(text).toContain('Disallow: /admin/')
    expect(text).toContain('Sitemap: https://a.com/sitemap.xml')
  })

  it('解析后能重建等价配置', () => {
    const src = `User-agent: *\nDisallow: /admin/\nAllow: /\nCrawl-delay: 5\n\nSitemap: https://a.com/sitemap.xml`
    const cfg = parseRobots(src)
    expect(cfg.groups[0]?.agent).toBe('*')
    expect(cfg.groups[0]?.crawlDelay).toBe('5')
    expect(cfg.groups[0]?.rules).toHaveLength(2)
    expect(cfg.sitemaps).toContain('https://a.com/sitemap.xml')
    expect(buildRobots(cfg)).toContain('Disallow: /admin/')
  })

  it('多个 User-agent 合并到同组', () => {
    const cfg = parseRobots('User-agent: GPTBot\nUser-agent: CCBot\nDisallow: /')
    expect(cfg.groups).toHaveLength(1)
    expect(cfg.groups[0]?.agent).toBe('GPTBot, CCBot')
  })

  it('注释与空行被忽略', () => {
    const cfg = parseRobots('# 注释\n\nUser-agent: *\n# x\nDisallow: /a')
    expect(cfg.groups[0]?.rules).toHaveLength(1)
  })

  it('全站禁止会报错', () => {
    const issues = validateRobots({ groups: [{ agent: '*', rules: [{ kind: 'disallow', path: '/' }], crawlDelay: '' }], sitemaps: [] })
    expect(issues.some((i) => i.level === 'error')).toBe(true)
  })

  it('缺少 sitemap 只给提示', () => {
    const issues = validateRobots(emptyConfig())
    expect(issues.some((i) => i.message.includes('Sitemap'))).toBe(true)
    expect(issues.every((i) => i.level !== 'error' || !i.message.includes('Sitemap'))).toBe(true)
  })

  it('crawl-delay 必须是整数', () => {
    const issues = validateRobots({ groups: [{ agent: '*', rules: [{ kind: 'allow', path: '/' }], crawlDelay: '1.5' }], sitemaps: [] })
    expect(issues.some((i) => i.message.includes('Crawl-delay'))).toBe(true)
  })
})
