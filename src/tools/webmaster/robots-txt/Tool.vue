<script setup lang="ts">
import { computed, ref } from 'vue'
import { PRESETS, buildRobots, emptyConfig, parseRobots, validateRobots, type RobotsConfig } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'

const mode = ref('build')
const tabs = [
  { id: 'build', label: '生成' },
  { id: 'parse', label: '解析' },
]

const config = ref<RobotsConfig>(emptyConfig())
const pasted = ref('')

const output = computed(() => buildRobots(config.value))
const issues = computed(() => validateRobots(config.value))

function applyPreset(i: number): void {
  const preset = PRESETS[i]
  if (preset) config.value = preset.build()
}

function addGroup(): void {
  config.value.groups.push({ agent: '*', rules: [{ kind: 'disallow', path: '' }], crawlDelay: '' })
}

function removeGroup(i: number): void {
  config.value.groups.splice(i, 1)
}

function addRule(gi: number): void {
  config.value.groups[gi]?.rules.push({ kind: 'disallow', path: '' })
}

function removeRule(gi: number, ri: number): void {
  config.value.groups[gi]?.rules.splice(ri, 1)
}

function setSitemaps(text: string): void {
  config.value.sitemaps = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function download(): void {
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'robots.txt'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function doParse(): void {
  config.value = parseRobots(pasted.value)
  mode.value = 'build'
}
</script>

<template>
  <div class="robots">
    <div class="bar">
      <BaseTabs v-model="mode" :tabs="tabs" />
      <span class="bar__gap" />
      <BaseButton size="sm" variant="ghost" @click="download">下载 robots.txt</BaseButton>
    </div>

    <template v-if="mode === 'build'">
      <div class="presets">
        <span class="u-xs u-dim">模板</span>
        <button v-for="(p, i) in PRESETS" :key="p.label" type="button" class="preset" @click="applyPreset(i)">{{ p.label }}</button>
        <BaseButton size="sm" variant="ghost" @click="addGroup">+ 规则组</BaseButton>
      </div>

      <div v-for="(group, gi) in config.groups" :key="gi" class="group">
        <div class="group__head">
          <div class="group__field">
            <span class="group__label">User-agent</span>
            <BaseInput v-model="group.agent" mono size="sm" placeholder="*" />
          </div>
          <div class="group__field group__field--narrow">
            <span class="group__label">Crawl-delay</span>
            <BaseInput v-model="group.crawlDelay" mono size="sm" placeholder="秒" />
          </div>
          <BaseButton size="sm" variant="ghost" @click="removeGroup(gi)">删除组</BaseButton>
        </div>

        <div class="rules">
          <div v-for="(rule, ri) in group.rules" :key="ri" class="rule">
            <select v-model="rule.kind" class="rule__kind">
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
            </select>
            <BaseInput v-model="rule.path" mono size="sm" placeholder="/admin/" />
            <button type="button" class="rule__del" aria-label="删除规则" @click="removeRule(gi, ri)">×</button>
          </div>
          <button type="button" class="rules__add" @click="addRule(gi)">+ 添加规则</button>
        </div>
      </div>

      <div class="sitemaps">
        <span class="u-xs u-dim">Sitemap（一行一个）</span>
        <BaseTextarea
          :model-value="config.sitemaps.join('\n')"
          :rows="3"
          placeholder="https://example.com/sitemap.xml"
          @update:model-value="setSitemaps"
        />
      </div>

      <div v-if="issues.length" class="issues">
        <div v-for="(issue, i) in issues" :key="i" :class="['issue', `issue--${issue.level}`]">
          {{ issue.level === 'error' ? '错误' : '提示' }}：{{ issue.message }}
        </div>
      </div>

      <div class="out">
        <div class="out__bar">
          <span class="u-xs u-dim">预览</span>
          <CopyButton :text="output" />
        </div>
        <pre class="out__code">{{ output }}</pre>
      </div>
    </template>

    <template v-else>
      <BaseTextarea v-model="pasted" :rows="12" placeholder="粘贴现有 robots.txt…" />
      <div class="u-row">
        <BaseButton size="sm" variant="primary" :disabled="!pasted.trim()" @click="doParse">解析并转为可视编辑</BaseButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.robots {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.bar__gap {
  flex: 1;
}
.presets {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.preset {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--c-border);
  font-size: var(--fs-xs);
  color: var(--c-text-2);
}
.preset:hover {
  border-color: var(--c-accent);
  color: var(--c-accent);
}
.group {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.group__head {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
}
.group__field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.group__field--narrow {
  flex: 0 0 110px;
}
.group__label {
  font-size: 10px;
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.rules {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rule {
  display: flex;
  gap: 4px;
  align-items: center;
}
.rule__kind {
  height: 28px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  font-size: var(--fs-xs);
  padding: 0 4px;
  flex: none;
}
.rule__del {
  width: 26px;
  height: 26px;
  color: var(--c-text-3);
  border-radius: var(--radius-sm);
  flex: none;
}
.rule__del:hover {
  color: var(--c-danger);
  background: var(--c-danger-weak);
}
.rules__add {
  align-self: flex-start;
  font-size: var(--fs-xs);
  color: var(--c-accent);
  padding: 2px 4px;
}
.sitemaps {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sitemap {
  display: flex;
  gap: 4px;
  align-items: center;
}
.issues {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.issue {
  font-size: var(--fs-xs);
  padding: 5px 8px;
  border-radius: var(--radius-sm);
}
.issue--error {
  color: var(--c-danger);
  background: var(--c-danger-weak);
}
.issue--warn {
  color: var(--c-warn);
  background: var(--c-warn-weak);
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  background: var(--c-code-bg);
  box-shadow: var(--clay-inset);
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 10px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-subtle);
}
.out__code {
  margin: 0;
  padding: var(--sp-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-code);
  white-space: pre-wrap;
  max-height: 300px;
  overflow: auto;
}
</style>
