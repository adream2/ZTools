/** 分类数据已移到 categories.ts，这里只做转发，避免老代码 import 路径断裂 */
export { CATEGORIES, categoryTitle, categoryTone } from './categories'

/** 品牌名：只改这一处（同时记得改 vite.config.ts 里的 manifest 与 index.html 标题） */
export const APP_NAME = 'ZT 工具箱'
export const APP_SHORT_NAME = '工具箱'
/** 工具总数写在 index.html 与 llms.txt 里，check-copy.mjs 会校验这几处是否一致 */
export const APP_DESC = '纯本地运行的中文在线工具箱，全部工具离线可用，数据不出浏览器。'

/** 源码仓库 */
export const REPO_URL = 'https://github.com/adream2/ZTools'

export interface SiteLink {
  name: string
  url: string
  desc: string
}

/** 同一作者的其它站点，页脚与关于页共用 */
export const SITE_LINKS: SiteLink[] = [
  { name: '乐享折腾', url: 'https://lxzt.fun', desc: '网址导航' },
  { name: 'ZT 折腾簿', url: 'https://www.ztsite.com', desc: '折腾笔记与博客' },
  { name: 'KeeTools', url: 'https://keetools.ztsite.com', desc: '另一套在线工具集' },
  { name: 'IP 查询', url: 'https://ip.lxzt.fun', desc: 'IP 归属地与网络信息' },
  { name: '爱打字', url: 'https://aidazi.lxzt.fun', desc: '打字练习' },
  { name: '网盘搜索', url: 'https://pansou.lxzt.fun', desc: '网盘资源搜索' },
]
