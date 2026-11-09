# ZT 工具箱

纯静态中文在线工具箱，120 个工具，115 个完全在浏览器本地运行。黏土拟态（claymorphism）界面，可安装成 PWA。

同一份产物部署到 **Cloudflare Workers / 腾讯 EdgeOne Pages / GitHub Pages**，零后端、零边缘函数、零 UI 框架、零 CDN。

## 特性

- **本地优先**：能放进浏览器的全部本地算，联网工具明确标注，只在你点查询时才发请求
- **黏土视觉**：大圆角 + 双层阴影 + 内高光，亮色主调、暗色适配；颜色/圆角/阴影全部走 token
- **重活隔离**：JSON/YAML 解析、哈希、正则、文本对比跑在 Web Worker，正则带 3 秒超时防 ReDoS
- **kind 驱动注册**：文本处理类工具只需 `meta.ts` + `logic.ts`，不写 UI，单工具 30–80 行
- **三平台同源**：Hash 路由 + 单一 base 来源，子路径部署不会白屏

## 快速开始

```bash
npm install
npm run dev          # 开发
npm run test         # 单元测试
npm run build        # 类型检查 + 构建
npm run verify       # 元数据 + 样式 + 产物三重校验
npm run icons        # 重新生成 PWA 图标
```

Node >= 20。

## 工具分布

| 分类 | 数量 | 覆盖 |
| --- | --- | --- |
| 开发调试 | 44 | 格式化、编解码、加密、生成、ID 解析、配置生成 |
| 站长网络 | 20 | IP/DNS、可达性、SEO、安全头、图标、二维码 |
| 内容创作 | 25 | 图片、Markdown、文本排版、CSS 生成器、符号 |
| 计算换算 | 31 | 金融、健康、日期、随机、单位、生活 |

## 目录结构

```
src/
├─ core/                 # 注册、路由、搜索、主题、Worker、联网、PWA
│  ├─ registry.ts        # import.meta.glob 自动注册 + kind 映射
│  ├─ types.ts           # ToolMeta（含 kind / subcategory）
│  └─ worker/            # 极简 RPC：超时、崩溃重建、进度回传
├─ components/
│  ├─ templates/         # 四种共享形态：TextOp / Generator / Lookup / Calc
│  ├─ ui/                # ClayCard / ClayIcon 与原子组件
│  └─ layout/            # 悬浮胶囊侧栏、顶栏、工具面板
├─ pages/                # Home / Category / ToolView / Settings / 关于 / 隐私 / 404
└─ tools/<分类>/<工具>/
```

## 两种新增工具的方式

### A. 命中模板形态（省事）

四个模板覆盖约一半工具：`text-op`（输入→操作→输出）、`generator`（表单→批量结果）、`lookup`（数据集搜索）、`calc`（输入→实时结果）。

只写两个文件：

```ts
// meta.ts
export default defineTool({
  id: 'my-tool', title: '我的工具', summary: '一句话说明',
  category: 'dev', subcategory: '编码', keywords: ['a','b','c','d'],
  order: 99, kind: 'text-op',
})

// logic.ts —— default 导出模板需要的数据
import type { TextOpLogic } from '@/components/templates/types'
const OPS = [{ id: 'up', label: '转大写' }]
const logic: TextOpLogic = { OPS, apply: (t, op) => (op === 'up' ? t.toUpperCase() : t) }
export default logic
```

模板组件只管骨架和五个插槽，**不要在模板里加 if**；一旦某个工具需要自定义布局，就不要声明 `kind`，改写成自己的 `Tool.vue`。

### B. 完全不规则（照旧）

`meta.ts` + `logic.ts` + `Tool.vue`，路由、侧栏、搜索、首页会自动收录。

```bash
npm run verify   # 新增后必须过：id 唯一、kebab、keywords≥4、networkHosts、样式无裸色值
```

## 部署

### Cloudflare Workers

```bash
npm run build && npx wrangler deploy
```

`wrangler.jsonc` 已配 `assets.directory` 与 SPA 回退，首次部署前把 `name` 改成你的 Worker 名。

### 腾讯 EdgeOne Pages

导入仓库，构建 `npm run build`，安装 `npm ci`，输出 `dist`，Node 22.11.0。配置已在 `edgeone.json` 里。绑国内域名需要 ICP 备案。

### GitHub Pages（备用）

主部署目标是 Cloudflare Workers，Pages 只作为备用域：

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**
2. 到 Actions 页手动 Run `Deploy to GitHub Pages`

工作流默认 **只在手动触发**（`workflow_dispatch`），因为没启用 Pages 时 push 会让 Actions 直接变红。想恢复自动部署，把 `.github/workflows/deploy.yml` 里注释掉的 `push:` 段取消注释。

工作流会自动设 `VITE_BASE=/<仓库名>/` 并跑 `check-dist.mjs`，base 不一致会直接失败。

### Cloudflare Workers + 自定义域名

本项目已按 `ztools.lxzt.fun` 配好：

```jsonc
// wrangler.jsonc
{
  "name": "ztools",
  "assets": { "directory": "./dist", "not_found_handling": "single-page-application" },
  "routes": [{ "pattern": "ztools.lxzt.fun", "custom_domain": true }]
}
```

部署：

```bash
npm run build
npx wrangler login      # 首次
npx wrangler deploy     # 自动创建 Worker + 绑定自定义域名
```

前提：`lxzt.fun` 的 NS 已指向 Cloudflare。如果域名还在别处解析，两个选择：

- 把 NS 迁到 Cloudflare（推荐，`custom_domain: true` 会自动签发证书）
- 保留现有 DNS，改用 `CNAME ztools → ztools.<account>.workers.dev`，并在 Cloudflare 面板里把域名加为 Custom Domain

`custom_domain` 要求域名托管在 Cloudflare，否则 deploy 会报错——这时把手动 `routes` 删掉，先在面板绑域名。

本地验证子路径（Git Bash 必须加 `MSYS_NO_PATHCONV=1`）：

```bash
MSYS_NO_PATHCONV=1 VITE_BASE=/WebTools/ npx vite build
MSYS_NO_PATHCONV=1 VITE_BASE=/WebTools/ npm run verify
cp dist/index.html dist/404.html
```

## PWA 策略

- **预缓存外壳**（约 210KB）：入口 HTML/JS/CSS、Vue 运行时、图标、manifest
- **工具按需缓存**：带 hash 的 chunk 走 `CacheFirst`，另有首访预热逻辑把本页已下载资源主动写进缓存
- **更新用 prompt**：`skipWaiting: false` + 设置页「重置本地缓存」兜底
- 第三方接口请求一律 `NetworkOnly`，避免隐私数据落盘

已知限制：**首次访问后重新打开一次，离线体验才完整**（第二次打开会补全懒加载的 CSS chunk）。

## SEO 与 GEO

### 已做的

- **语义化结构**：首页只有一个 `h1`，工具列表是 `nav` + 链接文本，FAQ 用 `dl`，页脚独立
- **完整 meta**：title / description / keywords / canonical / robots / OG / Twitter，工具页会动态替换 title 与 description
- **结构化数据**：`WebSite` + `WebApplication` + `FAQPage`（JSON-LD，内联在 index.html）
- **无 JS 也能读**：`<noscript>` 里有 120 个工具的分组文本清单和 FAQ，爬虫可直接提取
- **`/llms.txt`**：按 llms.txt 规范给出站点事实（工具数、隐私模型、免费）与全部工具索引，供生成式引擎抓取
- **AI 友好的正文**：首页底部有「关于 + 4 条 FAQ」，用直接陈述句回答「要不要联网」「数据会不会上传」「能不能离线」这类高频问题

### 硬限制

Hash 路由意味着**所有工具页共享同一个可索引 URL**，`/#/tools/json-formatter` 不会被搜索引擎当成独立页面收录。当前做法是把全部工具的文本、描述与 FAQ 压到首页承载。

要真正做到每个工具一个可索引页面，需要改成 History 路由 + 构建期预渲染（或 SSR），并处理 EdgeOne 不支持 SPA rewrite 的问题——属于架构级改动，不在当前范围内。

## 内容体系（AdSense 审核的关键）

工具站被 AdSense 拒的典型原因是「内容不足」——只有功能，没有可读文字。所以站内除工具外还有三层文字内容：

| 层 | 位置 | 作用 |
| --- | --- | --- |
| 使用指南 | `/#/guides`，22 篇原创长文 | 讲排查思路与原理，不是复述功能。每篇 1000–1500 字，含代码与实际报错 |
| 工具使用提示 | 每个工具页底部（`ToolMeta.tips`） | 2–3 条真实取舍与坑，例如「JPEG 不支持透明，工具会自动铺白底」 |
| 法务与联系 | `/#/terms`、`/#/privacy`、`/#/contact`、`/#/about` | 服务条款、隐私政策、可联系的邮箱、运营者署名 |

文章用 Markdown 存在 `src/content/guides.ts`，构建期由 `marked` + `DOMPurify` 渲染。新增一篇只要往数组里加个对象：

```ts
{
  slug: 'my-guide',
  title: '标题',
  summary: '一句话摘要，会显示在列表与首页',
  date: '2026-11-10',
  tags: ['标签'],
  tools: ['json-formatter'],   // 文末自动推荐相关工具
  body: `## 小标题\n\n正文…`,
}
```

路由、列表、首页区块、llms.txt 索引、JSON-LD 的 `Blog` 节点都会自动带上——除了 `index.html` 里的 `blogPost` 列表需要手动补一条（静态文件没法自动生成）。

**工具提示**加在 `meta.ts`：

```ts
export default defineTool({
  // ...
  tips: [
    '第一条要讲坑，不要重复 summary',
    '第二条讲取舍，比如「WebP 更小但老 Safari 不支持」',
  ],
})
```

目前 12 个高频工具已填，其余工具不显示该区块（`tips` 为空即不渲染）。

## 站长验证与广告接入

所有个性化配置都走环境变量，代码里不出现任何 ID。复制 `.env.example` 为 `.env.local` 后填写。

### 站长平台验证

| 平台 | 环境变量 | 注入的 meta name |
| --- | --- | --- |
| Google Search Console | `VITE_VERIFY_GOOGLE` | `google-site-verification` |
| Bing Webmaster | `VITE_VERIFY_BING` | `msvalidate.01` |
| 百度搜索资源平台 | `VITE_VERIFY_BAIDU` | `baidu-site-verification` |
| 搜狗站长 | `VITE_VERIFY_SOGOU` | `sogou_site_verification` |
| 360 站长 | `VITE_VERIFY_360` | `360-site-verification` |
| Yandex Webmaster | `VITE_VERIFY_YANDEX` | `yandex-verification` |

构建时由 Vite 插件注入到 `index.html` 的 `<head>`，未填的平台直接跳过。
需要 HTML 文件验证的平台（如部分 GSC 场景），把文件丢进 `public/` 即可，`html` 文件会原样发布到站点根。

### Google AdSense

1. 申请通过后拿到发布商 ID（形如 `ca-pub-1234567890123456`），填 `VITE_ADSENSE_CLIENT`
2. 在 AdSense 后台为每个广告位创建「自适应」广告单元，把 slot id 填进对应变量：
   - `VITE_ADSENSE_SLOT_HOME` — 首页工具列表下方
   - `VITE_ADSENSE_SLOT_TOOL` — 工具页内容下方
   - `VITE_ADSENSE_SLOT_CATEGORY` — 分类页底部
3. 重新构建，会自动完成三件事：
   - 往 `<head>` 注入 `adsbygoogle.js` 脚本
   - 生成 `dist/ads.txt`（`google.com, pub-xxx, DIRECT, f08c47fec0942fa0`）
   - 把静态文案里的「无广告」替换成「免费使用」，避免自相矛盾

**未配置时的行为**：不注入脚本、不渲染广告位、不发任何请求、`dist/ads.txt` 会被删除（防止线上出现假的授权记录）。

### 广告位组件

```vue
<script setup lang="ts">
import AdSlot from '@/components/ads/AdSlot.vue'
</script>

<AdSlot placement="homeBottom" :min-height="140" />
```

- `placement` 是槽位名，不是 slot id，id 只在环境变量里配
- 预留 `min-height` 避免广告加载后的布局跳动（CLS 影响 SEO 评分）
- 广告被拦截或脚本加载失败时不报错，页面功能不受影响
- 已有三个固定位置：首页底部、分类页底部、工具页底部，都在内容之后，不遮挡输入区

### 文案与合规

启用广告后这些地方会自动切换措辞：

- `index.html` 的 description / og / JSON-LD：`无广告` → `免费使用`
- 首页 FAQ 第四条：改成「通过广告覆盖成本，可用广告拦截扩展」
- 隐私页自动追加「关于广告」章节，说明 Google 使用 Cookie 与如何关闭个性化广告
- `llms.txt` 同步替换

**必须保留**：隐私政策（`/privacy`）里关于广告的说明是 AdSense 的政策要求，别删。

### 审核风险（实话）

AdSense 对「工具类聚合站」审核偏严，常见拒因是**内容量不足**（只有功能，没有文字内容）。当前站点的应对：

- 首页有「关于 + 4 条 FAQ」的原创文字
- 每个工具页有独立的一句话说明
- 有完整的关于页与隐私页

如果第一次被拒，优先补真实使用场景的文章（比如「怎么用 DNS 查询排查解析问题」），而不是继续堆工具。

### PWA 与广告

`workbox` 里第三方域名的请求一律 `NetworkOnly`，广告脚本不会被 Service Worker 缓存，也不会在离线时返回旧广告。代价是离线时广告位为空白占位。

## 样式体系

- `tokens.css`：色板、`--clay-raised/inset/pressed` 三档阴影、容器与控件两组圆角
- `base.css`：`.clay-card / .clay-list / .clay-table / .clay-inset` 语义类
- **行/表/导航不加阴影**，只用 `border-bottom` 分隔；黏土只给独立可交互对象
- `npm run verify:styles`：扫裸色值与「描边+圆角+overflow」回潮，防止新工具破坏体系

## 设计取舍

| 决策 | 原因 |
| --- | --- |
| Hash 路由 | EdgeOne Pages 不支持 SPA rewrite，这是三平台唯一零配置方案 |
| 不做全量 precache | 100+ 工具全量预缓存约 4MB，弱网安装会超时失败，反而失去离线能力 |
| 分类色只做装饰 | lemon/coral 当链接色 WCAG 直接不合格，交互色统一用 accent |
| 模板是默认值不是强制 | 溢出就独立写，避免模板里长出 `v-if="kind === ..."` |
| 做不了的直接剔除 | 端口扫描、站点信息卡在浏览器里做不了，不做假的 |

## 许可

MIT License，见 [LICENSE](./LICENSE)。

可以自由使用、修改、二次分发、商用部署，唯一要求是**保留原始的版权声明与许可声明**（`LICENSE` 文件里的那段话）。不用在页面上挂「Powered by」，也不用发邮件申请。

如果这个项目帮到你，给仓库点个 Star 就够了。
