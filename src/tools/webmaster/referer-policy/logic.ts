import type { LookupLogic, LookupItem } from '@/components/templates/types'

const RAW: [string, string, string, string][] = [
  ['no-referrer', '完全不发送 Referer', '任何跨域、同域请求都不带来源', '隐私要求最高的场景'],
  ['no-referrer-when-downgrade', '降级时不发送', 'HTTPS → HTTP 不带，其余带完整 URL', '浏览器历史默认值'],
  ['origin', '只发送源', '只带协议+域名+端口，不带路径', '兼顾隐私与统计'],
  ['origin-when-cross-origin', '跨域只发源', '同域发完整 URL，跨域只发源', '最常见的安全折中'],
  ['same-origin', '只在同域发送', '跨域请求完全不带 Referer', '阻止信息外泄'],
  ['strict-origin', '只发源且降级不发', 'HTTPS → HTTP 时不带，其余只发源', '严格隐私'],
  ['strict-origin-when-cross-origin', '默认推荐', '同域完整、跨域只源、降级不发', '浏览器默认值，绝大多数站点适用'],
  ['unsafe-url', '始终发送完整 URL', '任何情况都带完整路径与参数', '不推荐，会泄露敏感参数'],
]

const DATASET: LookupItem[] = RAW.map(([key, title, desc, use]) => ({
  key,
  title,
  desc,
  tags: [use],
  rows: [
    { label: '取值', value: key },
    { label: '行为', value: desc },
    { label: '适用', value: use },
    { label: '响应头', value: `Referrer-Policy: ${key}` },
  ],
}))

const logic: LookupLogic = {
  DATASET,
  placeholder: '搜索 strict、origin、no-referrer…',
  note: '现代浏览器默认 strict-origin-when-cross-origin；除非有明确理由，不要改成 unsafe-url',
}

export default logic
