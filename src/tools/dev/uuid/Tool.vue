<script setup lang="ts">
import { ref } from 'vue'
import { generate, type UuidVersion } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const version = ref<UuidVersion>('v4')
const count = ref('10')
const uppercase = ref(false)
const hyphens = ref(true)
const list = ref<string[]>([])

const versionOptions = [
  { label: 'v4 · 纯随机', value: 'v4' },
  { label: 'v7 · 时间有序', value: 'v7' },
]

function make(): void {
  const n = Math.min(200, Math.max(1, Math.round(Number(count.value)) || 1))
  list.value = generate({ version: version.value, count: n, uppercase: uppercase.value, hyphens: hyphens.value })
}

make()
</script>

<template>
  <div class="uuid">
    <div class="bar">
      <div class="bar__f">
        <Field label="版本">
          <BaseSelect v-model="version" :options="versionOptions" />
        </Field>
      </div>
      <div class="bar__f bar__f--narrow">
        <Field label="数量">
          <BaseInput v-model="count" type="number" />
        </Field>
      </div>
      <label class="chk"><BaseSwitch v-model="uppercase" /><span>大写</span></label>
      <label class="chk"><BaseSwitch v-model="hyphens" /><span>连字符</span></label>
      <BaseButton variant="primary" size="sm" @click="make">生成</BaseButton>
      <span class="bar__gap" />
      <CopyButton :text="list.join('\n')" label="复制全部" size="md" />
    </div>

    <div class="list" role="list">
      <div v-for="(id, i) in list" :key="id + i" class="list__row" role="listitem">
        <span class="list__idx">{{ i + 1 }}</span>
        <code class="list__id">{{ id }}</code>
        <CopyButton :text="id" label="" variant="ghost" />
      </div>
    </div>

    <p class="tip">
      v4 完全随机；v7 前 48 位是毫秒时间戳，宏观上按生成顺序递增，适合做数据库主键。两者都由 <code>crypto</code> 生成，不使用伪随机数。
    </p>
  </div>
</template>

<style scoped>
.uuid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.bar__f {
  width: 150px;
}
.bar__f--narrow {
  width: 88px;
}
.bar__gap {
  flex: 1;
}
.chk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  padding-bottom: 8px;
}
.list {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.list__row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 6px var(--sp-3);
  border-bottom: 1px solid var(--c-border);
}
.list__row:last-child {
  border-bottom: none;
}
.list__row:hover {
  background: var(--c-bg-subtle);
}
.list__idx {
  width: 24px;
  flex: none;
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  font-family: var(--font-mono);
  text-align: right;
}
.list__id {
  flex: 1;
  font-size: var(--fs-sm);
  user-select: all;
  word-break: break-all;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
.tip code {
  background: var(--c-bg-subtle);
  padding: 1px 4px;
  border-radius: 3px;
}
</style>
