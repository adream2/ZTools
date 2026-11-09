<script setup lang="ts">
import { ref, watch } from 'vue'
import { ALGOS, sign, type HmacAlgo, type OutputEncoding } from './logic'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const message = ref('')
const secret = ref('')
const algo = ref<HmacAlgo>('SHA-256')
const encoding = ref<OutputEncoding>('hex')
const output = ref('')
const error = ref('')

const algoOptions = ALGOS.map((a) => ({ label: a.label, value: a.id }))
const encodingOptions = [
  { label: '十六进制', value: 'hex' },
  { label: 'Base64', value: 'base64' },
]

async function run(): Promise<void> {
  error.value = ''
  output.value = ''
  if (!message.value && !secret.value) return
  try {
    output.value = await sign(message.value, secret.value, algo.value, encoding.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}

watch([message, secret, algo, encoding], () => void run(), { immediate: true })

function sample(): void {
  message.value = 'timestamp=1735660800&uid=10086&amount=99.00'
  secret.value = 'my-secret-key'
}
</script>

<template>
  <div class="hmac">
    <div class="bar">
      <div class="bar__f">
        <Field label="算法">
          <BaseSelect v-model="algo" :options="algoOptions" />
        </Field>
      </div>
      <div class="bar__f">
        <Field label="输出编码">
          <BaseSelect v-model="encoding" :options="encodingOptions" />
        </Field>
      </div>
      <div class="bar__grow">
        <Field label="密钥" hint="不会上传，仅本地计算">
          <BaseInput v-model="secret" type="password" placeholder="secret key" />
        </Field>
      </div>
      <BaseButton size="sm" variant="ghost" @click="sample">示例</BaseButton>
    </div>

    <Field label="消息内容" hint="接口签名时通常是排序后的参数串">
      <BaseTextarea v-model="message" :rows="8" placeholder="要签名的原文…" />
    </Field>

    <p v-if="error" class="err">{{ error }}</p>

    <div class="out clay-list">
      <div class="out__bar">
        <span class="u-xs u-dim">{{ output ? `${output.length} 字符 · ${encoding}` : '签名结果' }}</span>
        <CopyButton :text="output" />
      </div>
      <code class="out__text">{{ output || '填入消息与密钥后自动计算' }}</code>
    </div>

    <p class="tip">
      使用 WebCrypto 的 HMAC 实现，与后端 <code>hmac.New(sha256, key)</code> 结果一致；密钥只在本地参与运算。
    </p>
  </div>
</template>

<style scoped>
.hmac {
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
  width: 160px;
}
.bar__grow {
  flex: 1;
  min-width: 200px;
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
.out__text {
  display: block;
  padding: 14px;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  word-break: break-all;
  user-select: all;
  min-height: 56px;
  color: var(--c-text-2);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
.tip code {
  background: var(--c-bg-subtle);
  padding: 1px 5px;
  border-radius: 4px;
}
</style>
