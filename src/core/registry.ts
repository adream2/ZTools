import { defineComponent, h, type Component } from 'vue'
import { CATEGORIES, CATEGORY_IDS, type ToolCategory, type CategoryId } from './categories'
import type { ToolDefinition, ToolMeta, ToolKind } from './types'

type Globbed<T> = Record<string, T>

const metaModules = import.meta.glob<ToolMeta>('../tools/**/meta.ts', {
  eager: true,
  import: 'default',
})
const componentModules = import.meta.glob<Component>('../tools/**/Tool.vue', {
  import: 'default',
})
const logicModules = import.meta.glob<Record<string, unknown>>('../tools/**/logic.ts')

/** `../tools/dev/hash/meta.ts` → `dev/hash` */
function keyOf(path: string, filename: string): string {
  const tail = path.split('/tools/')[1] ?? path
  return tail.replace(new RegExp(`/${filename.replace('.', '\\.')}$`), '')
}

const componentMap = new Map<string, () => Promise<Component>>()
for (const [path, loader] of Object.entries(componentModules as Globbed<() => Promise<Component>>)) {
  componentMap.set(keyOf(path, 'Tool.vue'), loader)
}

/** kind → 共享模板组件 */
const TEMPLATES: Record<ToolKind, () => Promise<{ default: Component }>> = {
  'text-op': () => import('../components/templates/TextOpTool.vue'),
  generator: () => import('../components/templates/GeneratorTool.vue'),
  lookup: () => import('../components/templates/LookupTool.vue'),
  calc: () => import('../components/templates/CalcTool.vue'),
  'file-op': () => import('../components/templates/FileOpTool.vue'),
}

/**
 * kind 驱动的加载器：工具只需要 meta.ts + logic.ts，
 * logic 模块整体作为 prop 注入模板，模板自己决定怎么用。
 */
function templateLoader(kind: ToolKind, key: string): () => Promise<Component> {
  return async () => {
    const loadLogic = logicModules[`../tools/${key}/logic.ts`]
    if (!loadLogic) throw new Error(`[tool:${key}] kind=${kind} 但缺少 logic.ts`)
    const [mod, comp] = await Promise.all([loadLogic(), TEMPLATES[kind]()])
    // logic.ts 优先用 default 导出；没有就整体传命名空间
    const logic = (mod as { default?: unknown }).default ?? mod
    // 注意：这里必须直接返回组件，不能包成 { default }，否则 defineAsyncComponent 不会解包
    return defineComponent({
      name: `Tool_${key.replace('/', '_')}`,
      setup: () => () => h(comp.default, { logic }),
    })
  }
}

const defs: ToolDefinition[] = []
for (const [path, meta] of Object.entries(metaModules as Globbed<ToolMeta>)) {
  const key = keyOf(path, 'meta.ts')
  const component = meta.kind ? templateLoader(meta.kind, key) : componentMap.get(key)
  if (!component) {
    console.error(`[registry] src/tools/${key} 缺少 Tool.vue${meta.kind ? '' : '，也没声明 kind'}`)
    continue
  }
  defs.push({ meta, component })
}

// id 唯一性校验
if (import.meta.env.DEV) {
  const seen = new Map<string, number>()
  for (const d of defs) seen.set(d.meta.id, (seen.get(d.meta.id) ?? 0) + 1)
  for (const [id, n] of seen) if (n > 1) console.error(`[registry] 工具 id 重复：${id} × ${n}`)
}

export const ALL_TOOLS: ToolDefinition[] = defs
export const VISIBLE_TOOLS: ToolDefinition[] = defs.filter((d) => !d.meta.hidden)
export const TOOL_MAP = new Map(defs.map((d) => [d.meta.id, d]))

/**
 * 分类分组。键由 CATEGORY_IDS 生成，所以新增分类只需要改 categories.ts。
 * 遇到未登记的分类直接报错——宁可打红字也不能静默丢工具。
 */
const buckets = new Map<CategoryId, ToolDefinition[]>(CATEGORY_IDS.map((id) => [id, []]))
for (const d of VISIBLE_TOOLS) {
  const bucket = buckets.get(d.meta.category)
  if (!bucket) {
    console.error(
      `[registry] 工具「${d.meta.id}」的 category「${d.meta.category}」未在 src/core/categories.ts 登记，已跳过`,
    )
    continue
  }
  bucket.push(d)
}

export const TOOLS_BY_CATEGORY = Object.fromEntries(buckets) as Record<CategoryId, ToolDefinition[]>

for (const list of buckets.values()) {
  list.sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99) || a.meta.title.localeCompare(b.meta.title, 'zh'))
}

export interface CategoryWithTools extends ToolCategory {
  tools: ToolDefinition[]
}

export const CATEGORIES_WITH_TOOLS: CategoryWithTools[] = CATEGORIES.slice()
  .sort((a, b) => a.order - b.order)
  .map((c) => ({ ...c, tools: TOOLS_BY_CATEGORY[c.id] ?? [] }))
  .filter((c) => c.tools.length > 0)

/** 按分类顺序铺平的全部工具，首页与搜索默认用这个顺序 */
export const SORTED_TOOLS: ToolDefinition[] = CATEGORIES_WITH_TOOLS.flatMap((c) => c.tools)

/** 站点文案里的数字统一从这里取，避免到处手写 120 */
export const TOOL_COUNT = VISIBLE_TOOLS.length
export const NETWORK_TOOL_COUNT = VISIBLE_TOOLS.filter((d) => d.meta.privacy === 'network').length
export const LOCAL_TOOL_COUNT = TOOL_COUNT - NETWORK_TOOL_COUNT

export function getTool(id: string): ToolDefinition | undefined {
  return TOOL_MAP.get(id)
}
