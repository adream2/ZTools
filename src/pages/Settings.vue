<script setup lang="ts">
import { computed, ref } from 'vue'
import { themeMode, setTheme, type ThemeMode } from '@/core/theme'
import { allowNetwork } from '@/core/prefs'
import { VISIBLE_TOOLS } from '@/core/registry'
import { APP_NAME } from '@/core/config'
import { toastError, toastOk } from '@/core/toast'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ClayIcon from '@/components/ui/ClayIcon.vue'

const themes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
]

const version = __APP_VERSION__
const buildTime = __BUILD_TIME__

const resetting = ref(false)
const localCount = computed(() => VISIBLE_TOOLS.filter((t) => (t.meta.privacy ?? 'local') === 'local').length)

async function resetCache(): Promise<void> {
  resetting.value = true
  try {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
    toastOk('本地缓存已清除，即将刷新')
    setTimeout(() => location.reload(), 700)
  } catch (e) {
    toastError(`清除失败：${e instanceof Error ? e.message : String(e)}`)
    resetting.value = false
  }
}

function clearRecent(): void {
  try {
    localStorage.removeItem('zt-recent-tools')
  } catch {
    /* 忽略 */
  }
  toastOk('已清除最近使用记录')
  location.reload()
}
</script>

<template>
  <div class="page">
    <div class="card clay-card">
      <header class="head">
        <ClayIcon tone="var(--c-accent)" path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4 0a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.2a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 0Z" size="lg" />
        <div>
          <h1>设置</h1>
          <p class="u-muted">偏好保存在本机浏览器，不会同步到任何服务器。</p>
        </div>
      </header>

      <section class="section">
        <h2 class="section__title">外观</h2>
        <div class="row">
          <div class="row__label">
            <div>主题</div>
            <div class="row__hint">跟随系统时会随系统深浅色自动切换</div>
          </div>
          <div class="seg">
            <button
              v-for="t in themes"
              :key="t.value"
              type="button"
              :class="['seg__item', { 'is-active': themeMode === t.value }]"
              @click="setTheme(t.value)"
            >
              {{ t.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section__title">联网</h2>
        <div class="row">
          <div class="row__label">
            <div>允许联网工具发起请求</div>
            <div class="row__hint">
              关闭后，IP 查询、DNS 查询、站点检测会直接拒绝联网。
              {{ VISIBLE_TOOLS.length }} 个工具中 {{ localCount }} 个完全本地运行，不受此开关影响。
            </div>
          </div>
          <BaseSwitch v-model="allowNetwork" />
        </div>
        <p class="note">联网工具只在你点击查询时请求对应接口，请求不携带任何本地数据，也不会被本站记录。</p>
      </section>

      <section class="section">
        <h2 class="section__title">数据与离线</h2>
        <div class="row">
          <div class="row__label">
            <div>清除最近使用记录</div>
            <div class="row__hint">仅删除首页「最近使用」列表</div>
          </div>
          <BaseButton size="sm" @click="clearRecent">清除</BaseButton>
        </div>
        <div class="row">
          <div class="row__label">
            <div>重置本地缓存</div>
            <div class="row__hint">清除 Service Worker 与离线缓存，页面白屏或版本异常时使用</div>
          </div>
          <BaseButton size="sm" variant="danger" :loading="resetting" @click="resetCache">重置</BaseButton>
        </div>
        <p class="note">
          离线规则：应用外壳随安装缓存；工具按「用过即缓存」生效，首次打开某个工具需要联网。
        </p>
      </section>

      <section class="section">
        <h2 class="section__title">关于</h2>
        <dl class="kv">
          <dt>应用</dt>
          <dd>{{ APP_NAME }}</dd>
          <dt>版本</dt>
          <dd class="u-mono">{{ version }}</dd>
          <dt>构建日期</dt>
          <dd class="u-mono">{{ buildTime }}</dd>
          <dt>工具数</dt>
          <dd>{{ VISIBLE_TOOLS.length }}</dd>
          <dt>运行方式</dt>
          <dd>纯静态，无后端、无边缘函数</dd>
        </dl>
        <div class="links">
          <RouterLink to="/about">关于本站</RouterLink>
          <RouterLink to="/privacy">隐私说明</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 780px;
  margin: 0 auto;
  padding: var(--sp-2) var(--sp-2) var(--sp-6);
}
.card {
  padding: var(--sp-6) var(--sp-5);
  border-radius: var(--radius-container-lg);
}
.head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--c-border);
}
.head h1 {
  font-size: var(--fs-xl);
  letter-spacing: -0.02em;
}
.head p {
  font-size: var(--fs-sm);
  margin-top: 2px;
}
.section {
  padding: var(--sp-5) 0;
  border-bottom: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}
.section__title {
  font-size: var(--fs-2xs);
  font-weight: 600;
  color: var(--c-text-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
}
.row__label {
  font-size: var(--fs-md);
  min-width: 0;
}
.row__hint {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  margin-top: 3px;
  line-height: 1.6;
}
.seg {
  display: inline-flex;
  padding: 4px;
  gap: 3px;
  background: var(--c-surface-2);
  border-radius: var(--radius-pill);
  box-shadow: var(--clay-inset);
  flex: none;
}
.seg__item {
  padding: 5px 13px;
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  transition: all var(--dur-fast) var(--ease);
}
.seg__item.is-active {
  background: var(--c-surface);
  color: var(--c-text);
  box-shadow: var(--clay-raised-sm);
}
.note {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
.kv {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px var(--sp-3);
  font-size: var(--fs-sm);
}
.kv dt {
  color: var(--c-text-3);
}
.kv dd {
  margin: 0;
}
.links {
  display: flex;
  gap: var(--sp-4);
  font-size: var(--fs-sm);
}

@media (max-width: 640px) {
  .card {
    padding: var(--sp-4);
  }
  .row {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--sp-2);
  }
}
</style>
