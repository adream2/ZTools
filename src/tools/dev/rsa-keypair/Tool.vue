<script setup lang="ts">
import { ref } from 'vue'
import { OPENSSL_HINT, downloadPem, generateKeyPair, type KeyPairPem, type KeySize } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'
import { toastError } from '@/core/toast'

const bits = ref('2048')
const pair = ref<KeyPairPem | null>(null)
const busy = ref(false)
const error = ref('')

const sizeOptions = [
  { label: '2048 位（常用）', value: '2048' },
  { label: '3072 位', value: '3072' },
  { label: '4096 位（慢）', value: '4096' },
]

async function run(): Promise<void> {
  busy.value = true
  error.value = ''
  pair.value = null
  try {
    pair.value = await generateKeyPair(Number(bits.value) as KeySize)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    toastError(error.value)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="rsa">
    <div class="bar">
      <div class="bar__f">
        <Field label="密钥长度" hint="4096 位生成需要几秒">
          <BaseSelect v-model="bits" :options="sizeOptions" />
        </Field>
      </div>
      <BaseButton variant="primary" :loading="busy" @click="run">生成密钥对</BaseButton>
      <span v-if="pair" class="u-xs u-dim">{{ pair.bits }} 位 · {{ pair.createdAt.slice(0, 19).replace('T', ' ') }}</span>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div v-if="pair" class="blocks">
      <div class="block clay-list">
        <div class="block__bar">
          <span class="u-xs u-dim">公钥（SPKI / PEM）</span>
          <div class="u-row">
            <CopyButton :text="pair.publicKey" label="复制" />
            <BaseButton size="sm" variant="ghost" @click="downloadPem(pair.publicKey, 'public.pem')">下载</BaseButton>
          </div>
        </div>
        <pre class="block__code">{{ pair.publicKey }}</pre>
      </div>

      <div class="block clay-list">
        <div class="block__bar">
          <span class="u-xs u-dim">私钥（PKCS#8 / PEM）</span>
          <div class="u-row">
            <CopyButton :text="pair.privateKey" label="复制" />
            <BaseButton size="sm" variant="ghost" @click="downloadPem(pair.privateKey, 'private.pem')">下载</BaseButton>
          </div>
        </div>
        <pre class="block__code">{{ pair.privateKey }}</pre>
      </div>
    </div>

    <p class="tip">
      密钥在浏览器内用 WebCrypto 生成，不会离开本机。私钥请勿提交到仓库或粘贴到公开场合；可用
      <code>{{ OPENSSL_HINT }}</code> 校验。
    </p>
  </div>
</template>

<style scoped>
.rsa {
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
  width: 180px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.blocks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
.block {
  overflow: hidden;
}
.block__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 4px 12px;
  border-bottom: 1px solid var(--c-border);
}
.block__code {
  margin: 0;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.6;
  max-height: 300px;
  overflow: auto;
  word-break: break-all;
  white-space: pre-wrap;
  user-select: all;
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
@media (max-width: 760px) {
  .blocks {
    grid-template-columns: 1fr;
  }
}
</style>
