<script setup lang="ts">
import { ref } from 'vue'
import { decryptText, encryptText, entropyHint } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const mode = ref('encrypt')
const tabs = [
  { id: 'encrypt', label: '加密' },
  { id: 'decrypt', label: '解密' },
]

const input = ref('')
const password = ref('')
const output = ref('')
const error = ref('')
const busy = ref(false)

async function run(): Promise<void> {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) {
    error.value = '请输入内容'
    return
  }
  busy.value = true
  try {
    output.value =
      mode.value === 'encrypt'
        ? await encryptText(input.value, password.value)
        : await decryptText(input.value, password.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = false
  }
}

function swap(): void {
  if (!output.value) return
  input.value = output.value
  output.value = ''
  mode.value = mode.value === 'encrypt' ? 'decrypt' : 'encrypt'
}
</script>

<template>
  <div class="aes">
    <div class="bar">
      <BaseTabs v-model="mode" :tabs="tabs" />
      <div class="bar__pw">
        <Field label="密码" :hint="entropyHint(password)">
          <BaseInput v-model="password" type="password" placeholder="用于派生密钥" />
        </Field>
      </div>
      <BaseButton variant="primary" :loading="busy" @click="run">{{ mode === 'encrypt' ? '加密' : '解密' }}</BaseButton>
      <BaseButton variant="ghost" :disabled="!output" @click="swap">结果转输入</BaseButton>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div class="split">
      <Field :label="mode === 'encrypt' ? '明文' : '密文（Base64）'">
        <BaseTextarea v-model="input" :rows="12" :placeholder="mode === 'encrypt' ? '要加密的内容' : '粘贴 Base64 密文'" />
      </Field>
      <Field :label="mode === 'encrypt' ? '密文（Base64）' : '明文'">
        <div class="out clay-list">
          <div class="out__bar">
            <span class="u-xs u-dim">{{ output ? `${output.length} 字符` : '结果' }}</span>
            <CopyButton :text="output" />
          </div>
          <BaseTextarea v-model="output" :rows="12" readonly class="out__ta" placeholder="结果会出现在这里" />
        </div>
      </Field>
    </div>

    <p class="tip">
      AES-256-GCM + PBKDF2-SHA256（15 万次迭代），随机 salt 与 IV 一起打包进密文，前后端互通时按同样格式解析即可。
    </p>
  </div>
</template>

<style scoped>
.aes {
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
.bar__pw {
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
  padding: 4px 6px 4px 10px;
  border-bottom: 1px solid var(--c-border);
}
.out__ta {
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}
.out__ta:focus {
  box-shadow: none;
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
