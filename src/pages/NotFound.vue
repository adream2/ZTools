<script setup lang="ts">
import { APP_NAME } from '@/core/config'
</script>

<template>
  <div class="nf">
    <div class="nf__box clay-card">
      <div class="nf__code">404</div>
      <h1>页面不存在</h1>
      <p class="u-muted">这个工具可能已经改名或还没上线。</p>
      <div class="nf__actions">
        <RouterLink to="/" class="nf__btn nf__btn--primary">回到首页</RouterLink>
        <RouterLink to="/settings" class="nf__btn">打开设置</RouterLink>
      </div>
      <p class="nf__tip">{{ APP_NAME }}</p>
    </div>
  </div>
</template>

<style scoped>
.nf {
  display: grid;
  place-items: center;
  min-height: 72vh;
  padding: var(--sp-4);
}
.nf__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--sp-6) var(--sp-5);
  border-radius: var(--radius-container-lg);
  text-align: center;
  max-width: 420px;
}
.nf__code {
  font-family: var(--font-mono);
  font-size: 56px;
  font-weight: 600;
  color: var(--c-border-strong);
  line-height: 1;
  margin-bottom: var(--sp-2);
}
.nf__actions {
  display: flex;
  gap: var(--sp-2);
  margin-top: var(--sp-4);
}
.nf__btn {
  padding: 9px 18px;
  border-radius: var(--radius-pill);
  background: var(--c-surface);
  color: var(--c-text);
  font-size: var(--fs-sm);
  text-decoration: none;
  box-shadow: var(--clay-raised-sm);
  transition: all var(--dur-fast) var(--ease);
}
.nf__btn:hover {
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: var(--clay-raised);
}
.nf__btn:active {
  transform: none;
  box-shadow: var(--clay-pressed);
}
.nf__btn--primary {
  background: linear-gradient(180deg, #6f7eff, var(--c-accent));
  color: #fff;
  box-shadow: 0 5px 14px rgb(91 108 255 / 32%);
}
.nf__tip {
  margin-top: var(--sp-5);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
</style>
