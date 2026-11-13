<script setup lang="ts">
import ProsePage from '@/components/layout/ProsePage.vue'
import { APP_NAME, REPO_URL, SITE_LINKS } from '@/core/config'
import { VISIBLE_TOOLS } from '@/core/registry'
import { CONTACT_EMAIL, SITE_OWNER, SITE_SINCE } from '@/core/site-config'
</script>

<template>
  <ProsePage :title="`关于 ${APP_NAME}`" subtitle="一个不用注册、不传数据、可以离线的在线工具箱。">
    <h2>为什么做这个</h2>
    <p>
      常见的在线工具站大多把数据发到服务器处理，页面塞满广告，还得登录。这个站反过来：能放进浏览器的就全部在浏览器里算，
      跑不了的就明确标注「需联网」，并且只在你主动点查询时才发请求。
    </p>

    <h2>技术上的几个选择</h2>
    <ul>
      <li><strong>纯静态</strong>：没有后端、没有边缘函数，一份构建产物可以放到任何静态托管上。</li>
      <li><strong>独立地址</strong>：每个工具和文章都有自己的路径（<code>/tools/xxx</code>），可直接分享、被搜索引擎单独收录。</li>
      <li><strong>重活扔给 Worker</strong>：大 JSON、哈希、正则、图片压缩都在独立线程算，页面不会卡死；正则还带 3 秒强制超时。</li>
      <li><strong>离线优先</strong>：Service Worker 缓存应用外壳，断网也能打开已经访问过的工具。</li>
      <li><strong>零第三方 UI 库</strong>：界面是手写的 CSS 变量体系，暗色模式靠 token 切换，没有远程字体和图标 CDN。</li>
    </ul>

    <h2>部署</h2>
    <p>同一份产物适配三个平台，按自己的域名和网络情况挑一个：</p>
    <table>
      <thead>
        <tr><th>平台</th><th>配置文件</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr><td>Cloudflare Workers</td><td><code>wrangler.jsonc</code></td><td>静态资源免费，全球节点</td></tr>
        <tr><td>腾讯 EdgeOne Pages</td><td><code>edgeone.json</code></td><td>国内访问快，绑国内域名需备案</td></tr>
        <tr><td>GitHub Pages</td><td><code>.github/workflows/deploy.yml</code></td><td>完全免费，走子路径部署</td></tr>
      </tbody>
    </table>

    <h2>工具数量</h2>
    <p>当前共 {{ VISIBLE_TOOLS.length }} 个工具，全部可离线使用（联网类工具需要网络）。新增工具只需在 <code>src/tools/</code> 下加一个目录，路由、侧栏、搜索会自动收录。</p>

    <h2>内容与更新</h2>
    <p>
      除了工具本身，站内还有一份「<RouterLink to="/guides">使用指南</RouterLink>」，
      写的是具体场景下的排查思路——比如 JSON 报错怎么定位到行、DNS 不通按什么顺序排除。
      工具解决「做一次」，指南解决「想清楚」。
    </p>
    <p>
      站点会持续补充工具与文章，重大变更记录在页面底部的版本号里。
      如果你发现有工具结果不对，欢迎指出，我通常会在几天内修。
    </p>

    <h2>其他站点</h2>
    <p>同一作者维护的其它站点，各有侧重：</p>
    <ul class="sites">
      <li v-for="site in SITE_LINKS" :key="site.url">
        <a :href="site.url" target="_blank" rel="noopener noreferrer">{{ site.name }}</a>
        <span class="sites__desc">{{ site.desc }}</span>
      </li>
    </ul>

    <h2>源码与许可</h2>
    <p>
      源码托管在 <a :href="REPO_URL" target="_blank" rel="noopener noreferrer">GitHub</a>，
      采用 <strong>MIT 协议</strong>：可以自由使用、修改、二次分发甚至商用，
      只需保留原始的版权声明与许可声明。
    </p>
    <p>
      换句话说，拿去用、拿去改、拿去部署都行，别把作者署名抹掉就好。
      如果这个项目帮到了你，给仓库点个 Star 是最省事的支持方式。
    </p>

    <h2>联系方式</h2>
    <p>
      邮件：<a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
    </p>
    <p>
      本站由 {{ SITE_OWNER }} 独立开发与维护，{{ SITE_SINCE }} 年起持续更新。
      站点没有注册系统，不收集用户信息，因此也不存在账号相关的客服流程。
    </p>
    <p class="u-xs u-dim">© {{ SITE_SINCE }}–{{ new Date().getFullYear() }} {{ SITE_OWNER }}</p>
  </ProsePage>
</template>

<style scoped>
.sites {
  list-style: none;
  padding-left: 0 !important;
  display: grid;
  gap: 7px;
}
.sites li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.sites__desc {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
</style>
