<script setup lang="ts">
import { ref } from 'vue'
import { flagEmoji, lookupIp, lookupSelf, validateQuery, type IpInfo } from './logic'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Field from '@/components/ui/Field.vue'

const query = ref('')
const result = ref<IpInfo | null>(null)
const error = ref('')
const loading = ref(false)

async function search(self = false): Promise<void> {
  error.value = ''
  loading.value = true
  try {
    const target = self ? '' : validateQuery(query.value)
    result.value = target ? await lookupIp(target) : await lookupSelf()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    result.value = null
  } finally {
    loading.value = false
  }
}

const rows = (info: IpInfo) =>
  [
    { label: '国家 / 地区', value: info.country ? `${flagEmoji(info.countryCode)} ${info.country}` : '—' },
    { label: '省 / 州', value: info.region || '—' },
    { label: '城市', value: info.city || '—' },
    { label: '邮编', value: info.postal || '—' },
    { label: '运营商', value: info.isp || '—' },
    { label: '组织', value: info.org || '—' },
    { label: 'ASN', value: info.asn || '—' },
    { label: '时区', value: info.timezone || '—' },
    {
      label: '坐标',
      value: info.lat !== null && info.lon !== null ? `${info.lat}, ${info.lon}` : '—',
    },
  ]
</script>

<template>
  <div class="ip">
    <div class="bar">
      <div class="bar__grow">
        <Field label="IP 或域名" hint="留空则查询本机公网 IP">
          <BaseInput v-model="query" mono placeholder="8.8.8.8 或 example.com" @keydown.enter="search(false)" />
        </Field>
      </div>
      <BaseButton variant="primary" :loading="loading" @click="search(false)">查询</BaseButton>
      <BaseButton :loading="loading" @click="search(true)">查本机</BaseButton>
    </div>

    <p v-if="error" class="err">{{ error }}</p>

    <div v-if="result" class="card">
      <div class="card__head">
        <div>
          <div class="card__ip u-mono">{{ result.ip }}</div>
          <div class="card__loc">{{ result.country ? `${flagEmoji(result.countryCode)} ${result.country} · ${result.region} ${result.city}` : '—' }}</div>
        </div>
        <CopyButton :text="result.ip" label="复制 IP" />
      </div>

      <dl class="kv">
        <template v-for="r in rows(result)" :key="r.label">
          <dt>{{ r.label }}</dt>
          <dd>{{ r.value }}</dd>
        </template>
      </dl>

      <div class="card__foot">
        <span class="u-xs u-dim">数据来源：{{ result.source }}</span>
        <a
          v-if="result.lat !== null && result.lon !== null"
          class="u-xs"
          :href="`https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=10/${result.lat}/${result.lon}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          在地图上查看 ↗
        </a>
      </div>
    </div>

    <p class="tip">
      IP 归属地是运营商分配记录推算的结果，城市级精度有限，不能用于定位个人。查询会把这些 IP 直接发给数据源，本站不中转、不记录。
    </p>
  </div>
</template>

<style scoped>
.ip {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.bar {
  display: flex;
  align-items: flex-end;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.bar__grow {
  flex: 1;
  min-width: 240px;
}
.err {
  font-size: var(--fs-sm);
  color: var(--c-danger);
  background: var(--c-danger-weak);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  white-space: pre-wrap;
}
.card {
  border-radius: var(--radius-container-md);
  overflow: hidden;
  box-shadow: var(--clay-raised-sm);
  background: var(--c-surface);
}
.card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: var(--sp-4);
  background: var(--c-bg-subtle);
  border-bottom: 1px solid var(--c-border);
}
.card__ip {
  font-size: 20px;
  font-weight: 600;
}
.card__loc {
  font-size: var(--fs-sm);
  color: var(--c-text-2);
  margin-top: 2px;
}
.kv {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 0;
  font-size: var(--fs-sm);
}
.kv dt,
.kv dd {
  padding: 7px var(--sp-4);
  border-bottom: 1px solid var(--c-border);
}
.kv dt {
  color: var(--c-text-3);
  font-size: var(--fs-xs);
}
.kv dd {
  margin: 0;
  word-break: break-word;
}
.kv dt:nth-last-of-type(1),
.kv dd:last-of-type {
  border-bottom: none;
}
.card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px var(--sp-4);
  border-top: 1px solid var(--c-border);
}
.tip {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  line-height: 1.7;
}
</style>
