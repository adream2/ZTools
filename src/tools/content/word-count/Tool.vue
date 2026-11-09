<script setup lang="ts">
import { computed, ref } from 'vue'
import { charFrequency, count, keywords } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

const text = ref('')
const stats = computed(() => count(text.value))
const topKeywords = computed(() => keywords(text.value))
const chars = computed(() => charFrequency(text.value, 12))

const cards = computed(() => [
  { label: '总字符', value: stats.value.chars, hint: '含空格与标点' },
  { label: '不含空格', value: stats.value.charsNoSpace, hint: '常用计费口径' },
  { label: '汉字', value: stats.value.cjk, hint: 'CJK 统一表意文字' },
  { label: '英文词', value: stats.value.words, hint: '按空格与标点切分' },
  { label: '段落', value: stats.value.paragraphs, hint: '空行分隔' },
  { label: '行数', value: stats.value.lines, hint: '' },
  { label: '句数', value: stats.value.sentences, hint: '' },
  { label: '阅读时长', value: `${stats.value.readMinutes} 分`, hint: '中文 300 字/分钟' },
])

const maxKeyword = computed(() => Math.max(1, ...topKeywords.value.map((k) => k.count)))
</script>

<template>
  <div class="wc">
    <div class="bar">
      <span class="u-xs u-dim">粘贴或直接输入，实时统计</span>
      <span class="bar__gap" />
      <BaseButton size="sm" variant="ghost" @click="text = ''">清空</BaseButton>
    </div>

    <BaseTextarea v-model="text" :rows="10" placeholder="在这里输入或粘贴文本…" />

    <div class="cards">
      <div v-for="c in cards" :key="c.label" class="card">
        <div class="card__label">{{ c.label }}</div>
        <div class="card__value">{{ c.value }}</div>
        <div v-if="c.hint" class="card__hint">{{ c.hint }}</div>
      </div>
    </div>

    <div v-if="topKeywords.length" class="block">
      <div class="block__title">高频词</div>
      <div class="kws">
        <div v-for="k in topKeywords" :key="k.word" class="kw">
          <span class="kw__word">{{ k.word }}</span>
          <span class="kw__bar"><span :style="{ width: `${(k.count / maxKeyword) * 100}%` }" /></span>
          <span class="kw__n">{{ k.count }}</span>
        </div>
      </div>
    </div>

    <div v-if="chars.length" class="block">
      <div class="block__title">字符频率</div>
      <div class="chars">
        <span v-for="c in chars" :key="c.char" class="char">
          <b>{{ c.char }}</b><span>{{ c.count }}</span>
        </span>
      </div>
    </div>

    <p class="tip">
      朗读时长按每分钟 240 字估算；高频词会自动过滤常见虚词，中文按 2–4 字组合统计，只作参考。
    </p>
  </div>
</template>

<style scoped>
.wc {
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
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  gap: var(--sp-2);
}
.card {
  padding: 10px var(--sp-3);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg-subtle);
}
.card__label {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.card__value {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
}
.card__hint {
  font-size: 10px;
  color: var(--c-text-3);
}
.block__title {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  margin-bottom: var(--sp-2);
}
.kws {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kw {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-sm);
}
.kw__word {
  width: 96px;
  flex: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.kw__bar {
  flex: 1;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--c-bg-sunken);
  overflow: hidden;
}
.kw__bar span {
  display: block;
  height: 100%;
  background: var(--c-accent);
  border-radius: var(--radius-full);
}
.kw__n {
  width: 28px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.chars {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.char {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-full);
  font-size: var(--fs-sm);
}
.char span {
  font-size: 10px;
  color: var(--c-text-3);
  font-family: var(--font-mono);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
