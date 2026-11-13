import type { CategoryId } from './categories'

export type { ToolCategory } from './categories'

/** 分类 id 由 categories.ts 派生，新增分类不用改这里 */
export type ToolCategoryId = CategoryId

/** 数据是否离开浏览器 */
export type PrivacyLevel = 'local' | 'network'

/**
 * 工具形态。命中模板形态时只需要 meta.ts + logic.ts，不写 Tool.vue。
 * 溢出模板（需要自定义布局/交互）就留空，老老实实写 Tool.vue。
 */
export type ToolKind = 'text-op' | 'generator' | 'lookup' | 'calc' | 'file-op'

export interface ToolMeta {
  /** 全局唯一，同时作为 URL 段：/tools/{id} */
  id: string
  title: string
  /** 一句话说明，控制在 30 字内 */
  summary: string
  category: ToolCategoryId
  /** 分类下的二级分组，例如「编码」「格式化」 */
  subcategory?: string
  /** 搜索关键词：中英混排 + 常见别名 */
  keywords: string[]
  /** 同类内排序，小的在前 */
  order?: number
  /** 默认 local；联网工具必须声明，UI 会亮警示徽标 */
  privacy?: PrivacyLevel
  /** 联网工具的请求目标域名，用于隐私说明 */
  networkHosts?: string[]
  badge?: 'new' | 'beta' | 'limited'
  /** 未完成工具：不进侧栏与搜索，但路由可达 */
  hidden?: boolean
  /** 用共享模板渲染；缺省表示走自己的 Tool.vue */
  kind?: ToolKind
  /** 工具页底部的使用提示，2–4 条，讲取舍与坑而不是重复功能名 */
  tips?: string[]
}

export interface ToolDefinition {
  meta: ToolMeta
  /** vue-router 可直接消费的异步组件加载器 */
  component: () => Promise<unknown>
}
