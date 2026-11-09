<script setup lang="ts">
import { computed, ref } from 'vue'
import { checkAll, parseUrls, summaryOf, type CheckItem } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const input = ref('https://example.com\nhttps://www.baidu.com\nhttps://this-domain-should-not-exist-12345.com')
const items = ref<CheckItem[]>([])
const busy = ref(false)
const progress = ref(0)
const total = ref(0)
const error = ref('')

const summary = computed(() => (items.value.length ? summaryOf(items.value) : null))

async function run(): Promise<void> {
  error.value = ''
  items.value = []
  const urls = parseUrls(input.value)
  if (!urls.length) {
    error.value = '请输入至少一条链接'
    return
  }

  busy.value = true
  total.value = urls.length
  progress.value = 0
  try {
    items.value = await checkAll(urls, (done, t) => {
      progress.value = done
      total.value = t
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

const failText = computed(() => items.value.filter((i) => !i.ok).map((i) => i.url).join('\n'))
</script>

<template>
  <div class="batch">
    <div class="notice">
      浏览器只能发 <code>no-cors</code> 请求，所以「可访问」的判定是「连接没被拒绝」，读不到 HTTP 状态码；返回 404 的链接也会显示为可访问。
    </div>

    <Field label="链接列表" hint="一行一个，最多 50 条">
      <BaseTextarea v-model="input" :rows="7" placeholder="https://example.com/a&#10;example.com/b" />
    </Field>

    <div class="bar">
      <BaseButton variant="primary" :loading="busy" @click="run">开始检测</BaseButton>
      <span v-if="busy" class="u-xs u-dim">检测中 {{ progress }} / {{ total }}</span>
      <span class="u-grow" />
      <CopyButton v-if="failText" :text="failText" label="复制失败链接" size="md" />
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <template v-if="items.length">
      <div v-if="summary" class="stats">
        <span>共 <b>{{ summary.total }}</b> 条</span>
        <span class="is-ok">可访问 <b>{{ summary.ok }}</b></span>
        <span class="is-bad">失败 <b>{{ summary.fail }}</b></span>
        <span>平均耗时 <b>{{ summary.avg }} ms</b></span>
      </div>

      <div class="list clay-list">
        <div v-for="item in items" :key="item.url" class="row">
          <span :class="['dot', item.ok ? 'is-ok' : 'is-bad']" />
          <code class="row__url">{{ item.url }}</code>
          <span class="row__ms">{{ item.ok ? `${item.ms} ms` : item.error }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.batch {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.notice {
  font-size: var(--fs-xs);
  line-height: 1.7;
  color: var(--c-warn);
  background: var(--c-warn-weak);
  border-radius: var(--radius-control-sm);
  padding: 9px 12px;
}
.notice code {
  background: rgb(0 0 0 / 6%);
  padding: 1px 4px;
  border-radius: 3px;
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.stats {
  display: flex;
  gap: var(--sp-4);
  flex-wrap: wrap;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
.stats b {
  color: var(--c-text-2);
  font-family: var(--font-mono);
  font-weight: 600;
}
.stats .is-ok b {
  color: var(--c-ok);
}
.stats .is-bad b {
  color: var(--c-danger);
}
.list {
  overflow: hidden;
  max-height: 420px;
  overflow-y: auto;
}
.row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 8px 14px;
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-sm);
}
.row:last-child {
  border-bottom: none;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
}
.dot.is-ok {
  background: var(--c-ok);
}
.dot.is-bad {
  background: var(--c-danger);
}
.row__url {
  flex: 1;
  font-size: var(--fs-xs);
  word-break: break-all;
  min-width: 0;
}
.row__ms {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  color: var(--c-text-3);
}
</style>
