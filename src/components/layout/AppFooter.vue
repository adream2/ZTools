<script setup lang="ts">
import { REPO_URL, SITE_LINKS } from '@/core/config'

const version = __APP_VERSION__.split('+')[0]
</script>

<template>
  <footer class="foot">
    <nav class="foot__links" aria-label="站点信息">
      <RouterLink to="/topics">专题</RouterLink>
      <RouterLink to="/guides">使用指南</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/about">关于</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/privacy">隐私说明</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/terms">服务条款</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/contact">联系</RouterLink>
      <span class="foot__sep" aria-hidden="true">·</span>
      <RouterLink to="/settings">设置</RouterLink>
    </nav>

    <span class="foot__divider" aria-hidden="true" />

    <nav class="foot__sites" aria-label="同作者的其它站点">
      <span class="foot__sites-label">其他站点</span>
      <a
        v-for="site in SITE_LINKS"
        :key="site.url"
        :href="site.url"
        :title="site.desc"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ site.name }}
      </a>
      <span class="foot__sep" aria-hidden="true">·</span>
      <a :href="REPO_URL" target="_blank" rel="noopener noreferrer" title="源码（MIT 协议）">GitHub</a>
    </nav>

    <div class="foot__meta">
      <span class="foot__claim">纯静态 · 无后端 · 数据不出浏览器</span>
      <span class="foot__ver">v{{ version }}</span>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  grid-column: 1 / -1;
  grid-row: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 9px var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  border-top: 1px solid color-mix(in srgb, var(--c-border) 80%, transparent);
}
.foot__links {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: none;
}
.foot__links a {
  color: var(--c-text-2);
}
.foot__sep {
  opacity: 0.5;
}
.foot__divider {
  width: 1px;
  height: 12px;
  background: var(--c-border);
  flex: none;
}
.foot__sites {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
  font-size: var(--fs-2xs);
  min-width: 0;
}
.foot__sites-label {
  color: var(--c-text-3);
  opacity: 0.7;
  letter-spacing: 0.04em;
}
.foot__sites a {
  color: var(--c-text-3);
  text-decoration: none;
  white-space: nowrap;
}
.foot__meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-size: var(--fs-2xs);
  flex: none;
}
.foot__ver {
  font-family: var(--font-mono);
}

.foot__links a:hover,
.foot__sites a:hover {
  color: var(--c-accent);
  text-decoration: underline;
}

@media (max-width: 1080px) {
  .foot__claim {
    display: none;
  }
}
@media (max-width: 900px) {
  .foot {
    padding: 9px var(--sp-3) 10px;
    gap: 6px 10px;
  }
  .foot__divider {
    display: none;
  }
  .foot__meta {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}
@media (max-width: 640px) {
  .foot__links {
    gap: 6px;
    font-size: 11px;
  }
  .foot__sites {
    font-size: 10.5px;
    gap: 8px;
  }
}
</style>
