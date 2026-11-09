<script setup lang="ts">
import { computed } from 'vue'
import { THEME_LABEL, cycleTheme, themeMode } from '@/core/theme'
import { openPalette, drawerOpen } from '@/core/ui-state'
import { VISIBLE_TOOLS } from '@/core/registry'
import { APP_NAME } from '@/core/config'

const total = VISIBLE_TOOLS.length

const themeIcon = computed(() =>
  themeMode.value === 'system'
    ? 'M12 3v2m0 14v2M5 12H3m18 0h-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0'
    : themeMode.value === 'light'
      ? 'M12 4v1m0 14v1M4 12h1m14 0h1M6.5 6.5l.7.7m9.6 9.6.7.7m0-11 .7-.7M7.2 17.3l-.7.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0'
      : 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5',
)
</script>

<template>
  <header class="top">
    <button type="button" class="top__menu" aria-label="打开菜单" @click="drawerOpen = true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
      </svg>
    </button>

    <RouterLink to="/" class="top__brand">
      <span class="top__logo" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="m9 4 10 10M4 14l6 6M14 4h6v6M10 20H4v-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span class="top__titles">
        <span class="top__name">{{ APP_NAME }}</span>
        <span class="top__tag">{{ total }} 个工具 · 纯本地运行</span>
      </span>
    </RouterLink>

    <button type="button" class="top__search" aria-label="搜索工具（快捷键 Ctrl K）" @click="openPalette">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" stroke-linecap="round" />
      </svg>
      <span class="top__search-text">搜索 {{ total }} 个工具</span>
      <kbd>Ctrl K</kbd>
    </button>

    <div class="top__actions">
      <button type="button" class="top__icon top__icon--search" title="搜索工具（Ctrl K）" aria-label="搜索工具" @click="openPalette">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" stroke-linecap="round" />
        </svg>
      </button>
      <button
        type="button"
        class="top__icon"
        :title="`主题：${THEME_LABEL[themeMode]}`"
        :aria-label="`切换主题，当前${THEME_LABEL[themeMode]}`"
        @click="cycleTheme"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path :d="themeIcon" stroke-linecap="round" />
        </svg>
      </button>
      <RouterLink to="/settings" class="top__icon" title="设置" aria-label="设置">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.2a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 0Z" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.top {
  position: relative;
  grid-column: 1 / -1;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 0 var(--sp-2);
  background: transparent;
  z-index: 50;
}

/* 品牌 */
.top__menu {
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-control-md);
  color: var(--c-text-2);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
  flex: none;
}
.top__menu:active {
  box-shadow: var(--clay-pressed);
}
.top__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--c-text);
  min-width: 0;
  flex: none;
}
.top__brand:hover {
  text-decoration: none;
}
.top__logo {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-control-md);
  background: linear-gradient(180deg, #7b89ff, var(--c-accent));
  color: #fff;
  box-shadow:
    0 5px 14px rgb(91 108 255 / 32%),
    inset 0 1px 0 rgb(255 255 255 / 30%);
  flex: none;
}
.top__titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.top__name {
  font-family: var(--font-brand);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.25;
  white-space: nowrap;
}
.top__tag {
  font-size: 11px;
  color: var(--c-text-3);
  line-height: 1.3;
  white-space: nowrap;
}

/* 中间搜索框：绝对居中，与左右块宽无关 */
.top__search {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 9px;
  width: min(520px, 38vw);
  height: 40px;
  padding: 0 15px;
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);
  box-shadow: var(--clay-inset);
  color: var(--c-text-3);
  font-size: var(--fs-sm);
  transition: box-shadow var(--dur-fast) var(--ease);
}
.top__search:hover {
  color: var(--c-text-2);
  box-shadow:
    var(--clay-inset),
    0 0 0 2px color-mix(in srgb, var(--c-accent) 26%, transparent);
}
.top__search-text {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top__search kbd {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: var(--c-surface);
  color: var(--c-text-3);
  box-shadow: var(--clay-raised-sm);
  flex: none;
}

/* 右侧图标 */
.top__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
.top__icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-control-md);
  color: var(--c-text-2);
  background: var(--c-surface);
  box-shadow: var(--clay-raised-sm);
  transition:
    box-shadow var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.top__icon:hover {
  transform: translateY(-1px);
  box-shadow: var(--clay-raised);
  color: var(--c-text);
}
.top__icon:active {
  transform: none;
  box-shadow: var(--clay-pressed);
}
/* 宽屏有中间搜索框时不重复显示搜索图标 */
.top__icon--search {
  display: none;
}

@media (max-width: 1080px) {
  .top__search {
    display: none;
  }
  .top__icon--search {
    display: grid;
  }
}
@media (max-width: 900px) {
  .top__menu {
    display: grid;
  }
  .top {
    padding: 0;
  }
}
@media (max-width: 520px) {
  .top__tag {
    display: none;
  }
  .top__name {
    font-size: 15px;
  }
  .top__icon {
    width: 36px;
    height: 36px;
  }
}
</style>
