/**
 * 分类唯一数据源。
 *
 * 新增一个分类只改这里一处：类型、侧栏、首页分组、校验脚本全部由它派生。
 * 目录 `src/tools/<id>/<工具>/meta.ts` 里的 category 必须能在下面找到，否则
 * registry 会报错、`npm run verify:meta` 会拦下来。
 */
export interface ToolCategory {
  id: string
  title: string
  summary: string
  /** 内联 SVG path（24x24 viewBox），避免图标库 */
  icon: string
  order: number
}

export const CATEGORIES = [
  {
    id: 'dev',
    title: '开发调试',
    summary: '格式化、编解码、哈希、时间',
    icon: 'M8 6 3 12l5 6M16 6l5 6-5 6',
    order: 1,
  },
  {
    id: 'webmaster',
    title: '站长网络',
    summary: 'IP、DNS、SEO、二维码',
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18',
    order: 2,
  },
  {
    id: 'content',
    title: '内容创作',
    summary: '图片、Markdown、颜色',
    icon: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5',
    order: 3,
  },
  {
    id: 'calc',
    title: '计算换算',
    summary: '单位、进制、日期、金融',
    icon: 'M6 4h12v16H6zM9 9h6M9 13h6M9 17h3',
    order: 4,
  },
  {
    id: 'life',
    title: '生活实用',
    summary: '健康、日常、家庭',
    icon: 'M12 20.5S4 15.8 4 10.2A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 8 2.4c0 5.6-8 10.3-8 10.3z',
    order: 5,
  },
  {
    id: 'edu',
    title: '学习教育',
    summary: '数学、化学、语言',
    icon: 'M12 6.4C10 4.9 7.2 4.4 4 5v13c3.2-.6 6 0 8 1.6 2-1.6 4.8-2.2 8-1.6V5c-3.2-.6-6 0-8 1.4zM12 6.4V19',
    order: 6,
  },
] as const satisfies readonly ToolCategory[]

/** 分类 id 联合类型，从 CATEGORIES 派生，不再手写 */
export type CategoryId = (typeof CATEGORIES)[number]['id']

export const CATEGORY_IDS: readonly CategoryId[] = CATEGORIES.map((c) => c.id)

export function isCategoryId(id: string): id is CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(id)
}

export function categoryTitle(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.title ?? id
}

/** 分类主题色（装饰用，不用于链接与按钮） */
const CATEGORY_TONE: Record<CategoryId, string> = {
  dev: 'var(--c-cat-dev)',
  webmaster: 'var(--c-cat-webmaster)',
  content: 'var(--c-cat-content)',
  calc: 'var(--c-cat-calc)',
  life: 'var(--c-cat-life)',
  edu: 'var(--c-cat-edu)',
}

export function categoryTone(id: string): string {
  return (CATEGORY_TONE as Record<string, string>)[id] ?? 'var(--c-accent)'
}
