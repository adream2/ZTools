import type { GeneratorLogic } from '@/components/templates/types'

const PRESET: Record<string, { value: string; note: string }> = {
  html: { value: 'no-cache', note: '入口 HTML 必须回源校验，否则发版不生效' },
  hashed: { value: 'public, max-age=31536000, immutable', note: '带内容哈希的 JS/CSS/字体' },
  asset: { value: 'public, max-age=604800', note: '不带哈希的图片、图标' },
  api: { value: 'private, no-store', note: '含用户数据的接口' },
  publicApi: { value: 'public, max-age=60, stale-while-revalidate=300', note: '可公开缓存但对时效敏感' },
  sw: { value: 'no-cache', note: 'Service Worker 必须不缓存，否则更新不生效' },
}

const FIELDS = [
  {
    key: 'type',
    label: '资源类型',
    type: 'select' as const,
    default: 'html',
    options: [
      { label: 'HTML 入口', value: 'html' },
      { label: '带哈希的静态资源', value: 'hashed' },
      { label: '图片 / 字体', value: 'asset' },
      { label: '私有接口', value: 'api' },
      { label: '公开接口', value: 'publicApi' },
      { label: 'Service Worker', value: 'sw' },
    ],
  },
  {
    key: 'format',
    label: '输出格式',
    type: 'select' as const,
    default: 'nginx',
    options: [
      { label: 'Nginx', value: 'nginx' },
      { label: 'Cloudflare _headers', value: 'cf' },
      { label: '仅指令', value: 'plain' },
    ],
  },
  { key: 'etag', label: '保留 ETag 协商', type: 'switch' as const, default: true },
]

const EXT: Record<string, string> = {
  html: 'index.html',
  hashed: '/assets/*',
  asset: '*.{png,jpg,svg,woff2}',
  api: '/api/*',
  publicApi: '/api/public/*',
  sw: '/sw.js',
}

function generate(values: Record<string, string | number | boolean>): string {
  const preset = PRESET[String(values.type)]
  if (!preset) throw new Error('未知资源类型')
  const format = String(values.format)
  const target = EXT[String(values.type)] ?? '/*'

  if (format === 'cf') {
    return `${target}\n  Cache-Control: ${preset.value}${values.etag ? '' : '\n  ETag: ""'}`
  }
  if (format === 'plain') {
    return `Cache-Control: ${preset.value}\n\n# ${preset.note}`
  }
  return `location ~ ${target} {\n  add_header Cache-Control "${preset.value}" always;\n${values.etag ? '  etag on;\n' : '  etag off;\n'}}\n\n# ${preset.note}`
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '带哈希的资源才能用 immutable；入口文件千万别长缓存',
  resultLabel: '配置',
}

export default logic
