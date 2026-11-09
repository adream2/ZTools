<script setup lang="ts">
import { computed, ref } from 'vue'
import { listPaths, query } from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const json = ref('{"user":{"name":"张三","tags":["admin","dev"],"profile":{"city":"杭州","age":28}}}')
const path = ref('user.tags[0]')

const parsed = computed(() => {
  try {
    return { result: query(json.value, path.value), error: '' }
  } catch (e) {
    return { result: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const suggestions = computed(() => listPaths(json.value, 40))

function pick(p: string): void {
  path.value = p
}
</script>

<template>
  <div class="jp">
    <div class="bar">
      <div class="bar__grow">
        <Field label="路径" hint="支持 a.b[0].c、$.a.b 写法">
          <BaseInput v-model="path" mono placeholder="user.profile.city" />
        </Field>
      </div>
    </div>

    <Field label="JSON">
      <BaseTextarea v-model="json" :rows="9" placeholder="粘贴 JSON…" :invalid="!!parsed.error" />
    </Field>

    <p v-if="parsed.error" class="err">{{ parsed.error }}</p>

    <template v-else-if="parsed.result">
      <div class="out clay-list">
        <div class="out__bar">
          <span class="u-xs u-dim">{{ parsed.result.type }}</span>
          <CopyButton :text="parsed.result.text" />
        </div>
        <pre class="out__code">{{ parsed.result.text }}</pre>
      </div>

      <div v-if="parsed.result.steps.length" class="steps">
        <span class="steps__label">解析路径</span>
        <span v-for="(s, i) in parsed.result.steps" :key="i" class="step">
          {{ s.label }}<span class="step__type">{{ s.type }}</span>
        </span>
      </div>
    </template>

    <div v-if="suggestions.length" class="suggest">
      <span class="steps__label">可用路径</span>
      <button v-for="p in suggestions" :key="p" type="button" class="chip" @click="pick(p)">{{ p }}</button>
    </div>
  </div>
</template>

<style scoped>
.jp {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  gap: var(--sp-3);
}
.bar__grow {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.out {
  overflow: hidden;
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 12px;
  border-bottom: 1px solid var(--c-border);
}
.out__code {
  margin: 0;
  padding: 14px;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-code);
  max-height: 260px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
.steps {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.steps__label {
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
  letter-spacing: 0.04em;
}
.step {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  background: var(--c-surface);
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  box-shadow: var(--clay-raised-sm);
}
.step__type {
  color: var(--c-text-3);
  font-size: 10px;
}
.suggest {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.chip {
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
}
.chip:hover {
  color: var(--c-accent);
  box-shadow: var(--clay-inset);
}
</style>
