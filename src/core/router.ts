import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { APP_NAME, CATEGORIES } from './config'
import { VISIBLE_TOOLS } from './registry'
import { CLAIMS_NO_ADS } from './site-config'
import { getGuide } from '@/content/guides'
import { getTopic } from '@/content/topics'
import { getTool } from './registry'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../pages/Home.vue') },
  { path: '/c/:cat', name: 'category', component: () => import('../pages/Category.vue'), props: true },
  { path: '/guides', name: 'guides', component: () => import('../pages/Guides.vue') },
  { path: '/guides/:slug', name: 'guide', component: () => import('../pages/GuideView.vue'), props: true },
  { path: '/topics', name: 'topics', component: () => import('../pages/Topics.vue') },
  { path: '/topics/:id', name: 'topic', component: () => import('../pages/TopicView.vue'), props: true },
  { path: '/tools/:id', name: 'tool', component: () => import('../pages/ToolView.vue'), props: true },
  { path: '/settings', name: 'settings', component: () => import('../pages/Settings.vue') },
  { path: '/about', name: 'about', component: () => import('../pages/About.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('../pages/Privacy.vue') },
  { path: '/terms', name: 'terms', component: () => import('../pages/Terms.vue') },
  { path: '/contact', name: 'contact', component: () => import('../pages/Contact.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../pages/NotFound.vue') },
]

export const router = createRouter({
  // history 模式：每个页面都有独立地址。三个部署目标都要开 SPA 回退
  // （Workers 用 not_found_handling，EdgeOne 用 404.html，GitHub Pages 用 404.html）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const id = typeof to.params.id === 'string' ? to.params.id : ''
  const tool = id ? getTool(id) : undefined
  if (tool) document.title = `${tool.meta.title} · ${APP_NAME}`
  else if (to.name === 'home') document.title = `${APP_NAME} · 纯本地在线工具`
  else if (to.name === 'category') {
    const title = CATEGORIES.find((c) => c.id === to.params.cat)?.title
    document.title = title ? `${title} · ${APP_NAME}` : `分类 · ${APP_NAME}`
  } else if (to.name === 'guides') document.title = `使用指南 · ${APP_NAME}`
  else if (to.name === 'guide') {
    const g = getGuide(String(to.params.slug ?? ''))
    document.title = g ? `${g.title} · ${APP_NAME}` : `使用指南 · ${APP_NAME}`
  } else if (to.name === 'topics') document.title = `专题 · ${APP_NAME}`
  else if (to.name === 'topic') {
    const t = getTopic(String(to.params.id ?? ''))
    document.title = t ? `${t.title} · ${APP_NAME}` : `专题 · ${APP_NAME}`
  } else if (to.name === 'settings') document.title = `设置 · ${APP_NAME}`
  else if (to.name === 'about') document.title = `关于 · ${APP_NAME}`
  else if (to.name === 'privacy') document.title = `隐私说明 · ${APP_NAME}`
  else if (to.name === 'terms') document.title = `服务条款 · ${APP_NAME}`
  else if (to.name === 'contact') document.title = `联系与反馈 · ${APP_NAME}`
  else document.title = `页面不存在 · ${APP_NAME}`

  syncCanonical(to.path)
  syncDescription(tool?.meta.summary)
})

/** history 路由下每个页面都是独立地址，canonical 指向自身 */
function syncCanonical(path: string): void {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const clean = path.replace(/\/+$/, '')
  const href = clean ? `${location.origin}${base}${clean}` : `${location.origin}${base}/`
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

/** 工具页把描述临时换成该工具的一句话说明，便于分享与抓取 */
function syncDescription(summary?: string): void {
  const base = `${APP_NAME}：纯本地运行的中文在线工具箱，${VISIBLE_TOOLS.length} 个工具，数据不出浏览器，无需注册${
    CLAIMS_NO_ADS ? '、无广告' : ''
  }。`
  const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (tag) tag.content = summary ? `${summary} · ${base}` : base
}
