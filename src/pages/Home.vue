<script setup lang="ts">
import { computed } from 'vue'
import { CATEGORIES_WITH_TOOLS, VISIBLE_TOOLS, getTool } from '@/core/registry'
import { recentTools } from '@/core/prefs'
import { APP_NAME, categoryTone } from '@/core/config'
import { TOPICS } from '@/content/topics'
import { CLAIMS_NO_ADS } from '@/core/site-config'
import { GUIDES, GUIDES_SORTED } from '@/content/guides'
import AdSlot from '@/components/ads/AdSlot.vue'

/** 首页只展示前三个专题，全量在 /topics */
const FEATURED_TOPICS = TOPICS.slice(0, 3)

const total = VISIBLE_TOOLS.length
const networkCount = VISIBLE_TOOLS.filter((t) => (t.meta.privacy ?? 'local') === 'network').length
const localCount = total - networkCount

const recent = computed(() =>
  recentTools.value
    .map((id) => getTool(id))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .slice(0, 8),
)

const FAQ = [
  {
    q: '这个工具箱需要联网吗？',
    a: `共 ${total} 个工具，其中 ${localCount} 个完全在浏览器本地运行，不需要联网。只有 IP 查询、DNS 查询、站点可达性检测等 ${networkCount} 个工具需要访问外部接口，且只在你点击查询时才发请求。`,
  },
  {
    q: '输入的敏感数据会被上传吗？',
    a: '不会。所有计算都在你的浏览器内存里完成，没有后端服务器，不设 Cookie、不接入统计或广告脚本。联网工具也只把你输入的域名或 IP 发给对应的公开接口。',
  },
  {
    q: '可以离线使用吗？',
    a: '可以。用浏览器菜单里的「安装应用」把它装到桌面或手机，应用外壳会缓存到本地；打开过的工具会按需缓存。首次访问后重新打开一次，离线体验才完整。',
  },
  {
    q: '免费吗？有广告或注册吗？',
    a: CLAIMS_NO_ADS
      ? '完全免费，没有广告、不需要注册，也没有使用次数限制。项目是纯静态站点，可以部署到 Cloudflare Workers、腾讯 EdgeOne Pages 或 GitHub Pages。'
      : '完全免费，不需要注册，也没有使用次数限制。站点通过在页面底部展示少量广告来覆盖服务器与域名成本，广告由 Google AdSense 提供；不想看可以用浏览器的广告拦截扩展，不影响工具功能。',
  },
]
</script>

<template>
  <div class="home">
    <h1 class="u-sr">{{ APP_NAME }} · {{ total }} 个纯本地在线工具</h1>

    <section v-if="recent.length" class="block">
      <div class="head">
        <h2 class="head__title">最近使用</h2>
      </div>
      <div class="grid grid--recent">
        <RouterLink v-for="t in recent" :key="t.meta.id" :to="`/tools/${t.meta.id}`" class="card card--mini">
          <span class="card__row">
            <span class="card__dot" :style="{ background: categoryTone(t.meta.category) }" aria-hidden="true" />
            <span class="card__title">{{ t.meta.title }}</span>
          </span>
        </RouterLink>
      </div>
    </section>

    <section v-for="cat in CATEGORIES_WITH_TOOLS" :key="cat.id" class="block">
      <div class="head">
        <span class="head__dot" :style="{ background: categoryTone(cat.id) }" aria-hidden="true" />
        <h2 class="head__title">{{ cat.title }}</h2>
        <span class="head__count">{{ cat.tools.length }}</span>
        <span class="head__line" aria-hidden="true" />
        <RouterLink :to="`/c/${cat.id}`" class="head__more">查看分类 →</RouterLink>
      </div>

      <div class="grid">
        <RouterLink
          v-for="t in cat.tools"
          :key="t.meta.id"
          :to="`/tools/${t.meta.id}`"
          class="card"
          :title="`${t.meta.title}：${t.meta.summary}`"
        >
          <span class="card__title">{{ t.meta.title }}</span>
          <span class="card__desc">{{ t.meta.summary }}</span>
          <span v-if="t.meta.badge === 'limited'" class="card__tag">受限</span>
          <span v-else-if="(t.meta.privacy ?? 'local') === 'network'" class="card__tag card__tag--net">需联网</span>
        </RouterLink>
      </div>
    </section>

    <section class="block topics-block" aria-labelledby="topics-title">
      <div class="head">
        <span class="head__dot" style="background: var(--c-accent)" aria-hidden="true" />
        <h2 id="topics-title" class="head__title">专题</h2>
        <span class="head__count">{{ TOPICS.length }}</span>
        <span class="head__line" aria-hidden="true" />
        <RouterLink to="/topics" class="head__more">全部专题 →</RouterLink>
      </div>
      <div class="topic-grid">
        <RouterLink
          v-for="t in FEATURED_TOPICS"
          :key="t.id"
          :to="`/topics/${t.id}`"
          class="topic"
          :style="{ '--tone': t.tone }"
        >
          <span class="topic__bar" aria-hidden="true" />
          <span class="topic__title">{{ t.title }}</span>
          <span class="topic__summary">{{ t.summary }}</span>
          <span class="topic__meta">{{ t.tools.length }} 个工具{{ t.guides?.length ? ' · 含指南' : '' }}</span>
        </RouterLink>
      </div>
    </section>

    <AdSlot placement="homeBottom" :min-height="140" />

    <section class="guides-block" aria-labelledby="guides-title">
      <div class="head">
        <span class="head__dot" style="background: var(--c-accent)" aria-hidden="true" />
        <h2 id="guides-title" class="head__title">使用指南</h2>
        <span class="head__count">{{ GUIDES.length }}</span>
        <span class="head__line" aria-hidden="true" />
        <RouterLink to="/guides" class="head__more">全部文章 →</RouterLink>
      </div>
      <div class="guide-grid">
        <RouterLink v-for="g in GUIDES_SORTED.slice(0, 3)" :key="g.slug" :to="`/guides/${g.slug}`" class="guide">
          <span class="guide__meta">{{ g.date }} · {{ g.tags.join(' / ') }}</span>
          <span class="guide__title">{{ g.title }}</span>
          <span class="guide__summary">{{ g.summary }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" class="faq__title">关于 {{ APP_NAME }}</h2>
      <p class="faq__lead">
        {{ APP_NAME }}是一个纯静态的中文在线工具箱，覆盖开发调试、站长网络、内容创作、计算换算四类场景。
        所有工具默认在浏览器本地运行，不依赖后端服务，也不会收集你的输入内容。
      </p>
      <dl class="faq__list">
        <template v-for="item in FAQ" :key="item.q">
          <dt>{{ item.q }}</dt>
          <dd>{{ item.a }}</dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1360px;
  margin: 0 auto;
  padding: var(--sp-3) var(--sp-4) var(--sp-6);
}

/* ---- 分组头 ---- */
.block {
  margin-bottom: var(--sp-6);
}
.head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 2px var(--sp-3);
}
.head__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex: none;
}
.head__title {
  font-size: 17px;
  font-weight: 600;
  color: var(--c-text);
  letter-spacing: -0.01em;
}
.head__count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--c-text-3);
  background: var(--c-surface);
  border-radius: var(--radius-pill);
  padding: 2px 9px;
  box-shadow: var(--clay-raised-sm);
}
.head__line {
  flex: 1;
  height: 1px;
  background: var(--c-border);
  margin: 0 6px;
}
.head__more {
  font-size: var(--fs-sm);
  color: var(--c-text-3);
  white-space: nowrap;
}
.head__more:hover {
  color: var(--c-accent);
}

/* ---- 工具卡片 ---- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: var(--sp-3);
}
.grid--recent {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 92px;
  padding: 15px 17px;
  border-radius: var(--radius-container-md);
  background: var(--c-surface);
  color: var(--c-text);
  text-decoration: none;
  box-shadow: var(--clay-raised-sm);
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
}
.card:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: var(--clay-raised);
}
.card:active {
  transform: none;
  box-shadow: var(--clay-pressed);
}
.card--mini {
  min-height: 0;
  padding: 10px 13px;
  border-radius: var(--radius-container-sm);
}
.card__row {
  display: flex;
  align-items: center;
  gap: 7px;
}
.card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
}
.card__title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
}
.card__desc {
  font-size: 12.5px;
  color: var(--c-text-3);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__tag {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 4px;
  color: var(--c-warn);
  background: var(--c-warn-weak);
}
.card__tag--net {
  color: var(--c-text-3);
  background: var(--c-bg-subtle);
}

/* ---- 使用指南 ---- */
.guides-block {
  margin-bottom: var(--sp-6);
}
.topics-block {
  margin-bottom: var(--sp-5);
}
.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: var(--sp-3);
}
.topic {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 17px 14px 21px;
  border-radius: var(--radius-container-md);
  background: var(--c-surface);
  box-shadow: var(--clay-raised);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform var(--dur-fast) var(--ease);
}
.topic:hover {
  transform: translateY(-2px);
}
.topic__bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--tone);
}
.topic__title {
  font-size: var(--fs-md);
  font-weight: 600;
}
.topic__summary {
  font-size: var(--fs-xs);
  color: var(--c-text-2);
  line-height: 1.6;
}
.topic__meta {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: var(--sp-3);
}
.guide {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 17px;
  border-radius: var(--radius-container-md);
  background: var(--c-surface);
  color: var(--c-text);
  text-decoration: none;
  box-shadow: var(--clay-raised-sm);
  transition:
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease);
}
.guide:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: var(--clay-raised);
}
.guide__meta {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.guide__title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
}
.guide__summary {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---- FAQ（同时服务 SEO 与生成式引擎抓取） ---- */
.faq {
  margin-top: var(--sp-5);
  padding: var(--sp-5);
  border-radius: var(--radius-container-lg);
  background: var(--c-surface);
  box-shadow: var(--clay-raised);
}
.faq__title {
  font-size: var(--fs-lg);
  letter-spacing: -0.01em;
}
.faq__lead {
  margin-top: var(--sp-2);
  font-size: var(--fs-md);
  color: var(--c-text-2);
  line-height: 1.8;
}
.faq__list {
  margin-top: var(--sp-4);
  display: grid;
  gap: var(--sp-3);
}
.faq__list dt {
  font-size: var(--fs-md);
  font-weight: 600;
  color: var(--c-text);
}
.faq__list dd {
  margin: 4px 0 0;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  line-height: 1.8;
}

@media (max-width: 640px) {
  .home {
    padding: 0 var(--sp-2) var(--sp-4);
  }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
    gap: var(--sp-2);
  }
  .card {
    min-height: 0;
    padding: 12px 14px;
    border-radius: var(--radius-container-sm);
  }
  .card__title {
    font-size: 14px;
  }
  .card__desc {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  .head__title {
    font-size: 15px;
  }
  .head__line {
    display: none;
  }
  .head__more {
    margin-left: auto;
  }
  .block {
    margin-bottom: var(--sp-5);
  }
  .faq {
    padding: var(--sp-4);
  }
}
</style>
