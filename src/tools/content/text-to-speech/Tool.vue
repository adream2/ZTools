<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import Field from '@/components/ui/Field.vue'
import { toastError, toastOk } from '@/core/toast'

const text = ref('生活如此美丽，折腾从不停止。这是一段用浏览器本地语音朗读的示例文本。')
const voices = ref<SpeechSynthesisVoice[]>([])
const voiceName = ref('')
const rate = ref(1)
const pitch = ref(1)
const speaking = ref(false)
const paused = ref(false)
const supported = ref(true)
const error = ref('')

const rateOptions = [
  { label: '0.8×（慢）', value: 0.8 },
  { label: '1.0×（正常）', value: 1 },
  { label: '1.2×', value: 1.2 },
  { label: '1.5×（快）', value: 1.5 },
]

const pitchOptions = [
  { label: '低', value: 0.85 },
  { label: '正常', value: 1 },
  { label: '高', value: 1.15 },
]

const charCount = computed(() => [...text.value].length)
const zhVoices = computed(() => voices.value.filter((v) => v.lang.toLowerCase().startsWith('zh')))

function loadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    supported.value = false
    return
  }
  const list = window.speechSynthesis.getVoices()
  voices.value = list
  if (!voiceName.value && list.length) {
    const preferred = list.find((v) => v.lang.toLowerCase().startsWith('zh')) ?? list[0]
    voiceName.value = preferred?.name ?? ''
  }
}

function speak(): void {
  if (!supported.value) return
  error.value = ''
  if (!text.value.trim()) {
    error.value = '先输入要朗读的文本'
    return
  }
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text.value)
  const voice = voices.value.find((v) => v.name === voiceName.value)
  if (voice) utter.voice = voice
  utter.rate = rate.value
  utter.pitch = pitch.value
  utter.lang = voice?.lang ?? 'zh-CN'
  utter.onstart = () => {
    speaking.value = true
    paused.value = false
  }
  utter.onend = () => {
    speaking.value = false
    paused.value = false
  }
  utter.onerror = (e) => {
    speaking.value = false
    paused.value = false
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      error.value = `朗读失败：${e.error}`
      toastError(error.value)
    }
  }
  window.speechSynthesis.speak(utter)
}

function togglePause(): void {
  if (!supported.value) return
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
    paused.value = false
  } else if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause()
    paused.value = true
  }
}

function stop(): void {
  if (!supported.value) return
  window.speechSynthesis.cancel()
  speaking.value = false
  paused.value = false
}

function copyText(): void {
  void navigator.clipboard
    .writeText(text.value)
    .then(() => toastOk('已复制'))
    .catch(() => toastError('复制失败，请手动选择'))
}

onMounted(() => {
  loadVoices()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    window.speechSynthesis.onvoiceschanged = null
  }
})
</script>

<template>
  <div class="tts">
    <p v-if="!supported" class="warn">当前浏览器不支持语音合成（SpeechSynthesis），换 Chrome / Edge 或升级系统。</p>

    <Field label="朗读内容" :hint="`${charCount} 字`">
      <BaseTextarea v-model="text" :rows="5" placeholder="粘贴或输入要朗读的文本" />
    </Field>

    <div class="row">
      <div class="row__item">
        <Field label="语音" :hint="zhVoices.length ? `${zhVoices.length} 个中文语音` : '未检测到中文语音'">
          <BaseSelect v-model="voiceName" :options="voices.map((v) => ({ label: `${v.name}（${v.lang}）`, value: v.name }))" />
        </Field>
      </div>
      <div class="row__item">
        <Field label="语速">
          <BaseSelect v-model="rate" :options="rateOptions" />
        </Field>
      </div>
      <div class="row__item">
        <Field label="音调">
          <BaseSelect v-model="pitch" :options="pitchOptions" />
        </Field>
      </div>
    </div>

    <div class="row">
      <BaseButton variant="primary" :disabled="!supported" @click="speak">{{ speaking ? '重新播放' : '播放' }}</BaseButton>
      <BaseButton :disabled="!speaking" @click="togglePause">{{ paused ? '继续' : '暂停' }}</BaseButton>
      <BaseButton :disabled="!speaking" @click="stop">停止</BaseButton>
      <BaseButton variant="ghost" @click="copyText">复制文本</BaseButton>
      <span class="u-xs u-dim">文本只交给系统语音引擎，不上传</span>
    </div>

    <p v-if="error" class="err">{{ error }}</p>
  </div>
</template>

<style scoped>
.tts {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.row {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.row__item {
  min-width: 180px;
  flex: 1;
}
.warn {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  background: var(--c-bg-subtle);
  padding: 8px 12px;
  border-radius: var(--radius-control-sm);
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
}
</style>
