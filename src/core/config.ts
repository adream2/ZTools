import type { ToolCategory } from './types'

/** 品牌名：只改这一处（同时记得改 vite.config.ts 里的 manifest 与 index.html 标题） */
export const APP_NAME = 'ZT 工具箱'
export const APP_SHORT_NAME = '工具箱'
export const APP_DESC = '纯本地运行的中文在线工具箱，120 个工具，数据不出浏览器。'

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

export const CATEGORIES: ToolCategory[] = [
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
    summary: 'IP、DNS、可达性、二维码',
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
    summary: '单位、进制、日期、密码',
    icon: 'M6 4h12v16H6zM9 9h6M9 13h6M9 17h3',
    order: 4,
  },
]
