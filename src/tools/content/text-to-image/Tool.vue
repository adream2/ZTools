<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { THEMES, download, renderCard, type CardOptions } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import Field from '@/components/ui/Field.vue'

const title = ref('ZT 工具箱')
const body = ref('120 个在线工具，全部在浏览器本地完成\n免注册、数据不出端')
const footer = ref('ztsite.com')
const size = ref('1080x1080')
const theme = ref('midnight')
const fontSize = ref('44')
const align = ref('left')

const preview = ref('')
const blob = ref<Blob | null>(null)
const busy = ref(false)

const SIZES: Record<string, { w: number; h: number }> = {
  '1080x1080': { w: 1080, h: 1080 },
  '1200x630': { w: 1200, h: 630 },
  '1080x1350': { w: 1080, h: 1350 },
  '750x1000': { w: 750, h: 1000 },
}

const sizeOptions = [
  { label: '1080 × 1080（方图）', value: '1080x1080' },
  { label: '1200 × 630（分享卡）', value: '1200x630' },
  { label: '1080 × 1350（竖版）', value: '1080x1350' },
  { label: '750 × 1000（长图）', value: '750x1000' },
]

const themeOptions = Object.entries(THEMES).map(([value, v]) => ({ label: v.label, value }))

const alignTabs = [
  { id: 'left', label: '左对齐' },
  { id: 'center', label: '居中' },
]

let timer: ReturnType<typeof setTimeout> | undefined

async function render(): Promise<void> {
  busy.value = true
  try {
    const dim = SIZES[size.value] ?? SIZES['1080x1080']!
    const options: CardOptions = {
      title: title.value,
      body: body.value,
      footer: footer.value,
      width: dim.w,
      height: dim.h,
      theme: theme.value,
      fontSize: Number(fontSize.value) || 44,
      align: align.value as 'left' | 'center',
    }
    const result = await renderCard(options)
    if (preview.value.startsWith('blob:')) URL.revokeObjectURL(preview.value)
    preview.value = result.url
    blob.value = result.blob
  } finally {
    busy.value = false
  }
}

watch([title, body, footer, size, theme, fontSize, align], () => {
  clearTimeout(timer)
  timer = setTimeout(() => void render(), 260)
})

void render()

function save(): void {
  if (blob.value) download(blob.value, `card-${Date.now()}.png`)
}

onBeforeUnmount(() => {
  clearTimeout(timer)
  if (preview.value.startsWith('blob:')) URL.revokeObjectURL(preview.value)
})
</script>

<template>
  <div class="tti">
    <div class="layout">
      <div class="form">
        <Field label="标题">
          <BaseInput v-model="title" placeholder="一句话主标题" />
        </Field>

        <Field label="正文" hint="支持换行，自动折行">
          <BaseTextarea v-model="body" :rows="4" />
        </Field>

        <Field label="页脚">
          <BaseInput v-model="footer" placeholder="站点或署名" />
        </Field>

        <div class="row">
          <div class="row__f">
            <Field label="尺寸">
              <BaseSelect v-model="size" :options="sizeOptions" />
            </Field>
          </div>
          <div class="row__f">
            <Field label="主题">
              <BaseSelect v-model="theme" :options="themeOptions" />
            </Field>
          </div>
        </div>

        <div class="row">
          <div class="row__f">
            <Field label="正文字号">
              <BaseInput v-model="fontSize" type="number" mono />
            </Field>
          </div>
          <div class="row__f">
            <Field label="对齐">
              <BaseTabs v-model="align" :tabs="alignTabs" />
            </Field>
          </div>
        </div>

        <BaseButton variant="primary" :loading="busy" @click="save">下载 PNG</BaseButton>
      </div>

      <div class="preview clay-inset">
        <img v-if="preview" :src="preview" alt="卡片预览" />
      </div>
    </div>

    <p class="tip">纯 Canvas 绘制，不加载任何外部字体或图片；导出尺寸与所选规格一致，可直接发社交平台。</p>
  </div>
</template>

<style scoped>
.tti {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.layout {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: var(--sp-4);
  align-items: start;
}
.form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.row {
  display: flex;
  gap: var(--sp-3);
}
.row__f {
  flex: 1;
  min-width: 0;
}
.preview {
  display: grid;
  place-items: center;
  padding: var(--sp-3);
  border-radius: var(--radius-container-md);
  min-height: 320px;
}
.preview img {
  max-width: 100%;
  max-height: 560px;
  border-radius: var(--radius-control-sm);
  box-shadow: var(--shadow-2);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
@media (max-width: 860px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .preview {
    min-height: 240px;
  }
}
</style>
