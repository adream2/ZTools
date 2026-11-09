<script setup lang="ts">
import { computed, ref } from 'vue'
import { convert, type YamlMode } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const mode = ref('yaml2json')
const tabs = [
  { id: 'yaml2json', label: 'YAML → JSON' },
  { id: 'json2yaml', label: 'JSON → YAML' },
]

const indent = ref('2')
const input = ref('')
const output = ref('')
const error = ref('')

const indentOptions = [
  { label: '2 空格', value: '2' },
  { label: '4 空格', value: '4' },
]

const placeholder = computed(() =>
  mode.value === 'yaml2json'
    ? 'name: zt-tools\nversion: 0.1.0\nfeatures:\n  - json\n  - yaml'
    : '{"name":"zt-tools","version":"0.1.0","features":["json","yaml"]}',
)

const SAMPLE_YAML = `service: zt-tools
replicas: 2
image: zt/tools:0.1.0
env:
  - name: TZ
    value: Asia/Shanghai
resources:
  limits:
    cpu: 500m
    memory: 256Mi
`

function run(): void {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  try {
    output.value = convert(input.value, mode.value as YamlMode, Number(indent.value))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    output.value = ''
  }
}

function sample(): void {
  input.value = mode.value === 'yaml2json' ? SAMPLE_YAML : '{"service":"zt-tools","replicas":2,"tags":["a","b"],"limits":{"cpu":"500m"}}'
  run()
}

function swapMode(): void {
  mode.value = mode.value === 'yaml2json' ? 'json2yaml' : 'yaml2json'
  if (output.value) {
    input.value = output.value
    output.value = ''
  }
}
</script>

<template>
  <div class="yaml">
    <div class="bar">
      <BaseTabs v-model="mode" :tabs="tabs" @update:model-value="output = ''" />
      <div v-if="mode === 'yaml2json'" class="bar__indent">
        <BaseSelect v-model="indent" :options="indentOptions" size="sm" />
      </div>
      <BaseButton variant="primary" size="sm" @click="run">转换</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="swapMode">换向</BaseButton>
      <BaseButton size="sm" variant="ghost" @click="sample">示例</BaseButton>
      <span class="bar__gap" />
      <BaseButton size="sm" variant="ghost" @click="input = ''; output = ''; error = ''">清空</BaseButton>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div class="split">
      <Field :label="mode === 'yaml2json' ? 'YAML' : 'JSON'">
        <BaseTextarea v-model="input" :rows="18" :placeholder="placeholder" :invalid="!!error" />
      </Field>
      <Field :label="mode === 'yaml2json' ? 'JSON' : 'YAML'">
        <div class="out">
          <div class="out__bar">
            <span class="u-xs u-dim">{{ output ? `${output.length} 字符` : '结果会出现在这里' }}</span>
            <CopyButton :text="output" />
          </div>
          <BaseTextarea v-model="output" :rows="18" readonly class="out__ta" />
        </div>
      </Field>
    </div>

    <p class="tip">
      解析使用 core schema，禁用自定义标签与危险类型；锚点引用数限制在 100 以内，避免 YAML 炸弹。注释在转换过程中会丢失（这是格式转换的固有限制）。
    </p>
  </div>
</template>

<style scoped>
.yaml {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__indent {
  width: 96px;
}
.bar__gap {
  flex: 1;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  white-space: pre-wrap;
  font-family: var(--font-mono);
}
.out {
  border-radius: var(--radius-container-sm);
  overflow: hidden;
  box-shadow: var(--clay-inset);
  background: var(--c-surface);
}
.out__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 10px;
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.out__ta {
  border: none;
  border-radius: 0;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
