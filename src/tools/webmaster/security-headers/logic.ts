import type { GeneratorLogic } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'server',
    label: '输出格式',
    type: 'select' as const,
    default: 'nginx',
    options: [
      { label: 'Nginx', value: 'nginx' },
      { label: 'Apache', value: 'apache' },
      { label: 'Cloudflare _headers', value: 'cf' },
    ],
  },
  { key: 'hsts', label: 'HSTS（强制 HTTPS）', type: 'switch' as const, default: true },
  { key: 'xfo', label: 'X-Frame-Options', type: 'switch' as const, default: true },
  { key: 'nosniff', label: 'X-Content-Type-Options', type: 'switch' as const, default: true },
  { key: 'referrer', label: 'Referrer-Policy', type: 'switch' as const, default: true },
  { key: 'permissions', label: 'Permissions-Policy', type: 'switch' as const, default: true },
  { key: 'csp', label: 'CSP（保守策略）', type: 'switch' as const, default: false },
]

const HEADERS: Record<string, string> = {
  hsts: 'Strict-Transport-Security: max-age=31536000; includeSubDomains',
  xfo: 'X-Frame-Options: SAMEORIGIN',
  nosniff: 'X-Content-Type-Options: nosniff',
  referrer: 'Referrer-Policy: strict-origin-when-cross-origin',
  permissions: 'Permissions-Policy: geolocation=(), microphone=(), camera=()',
  csp: "Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'",
}

function render(keys: string[], format: string): string {
  const lines = keys.map((k) => HEADERS[k]!).filter(Boolean)
  if (format === 'nginx') {
    return lines.map((h) => {
      const idx = h.indexOf(':')
      return `add_header ${h.slice(0, idx)} "${h.slice(idx + 1).trim()}" always;`
    }).join('\n')
  }
  if (format === 'apache') {
    return lines.map((h) => {
      const idx = h.indexOf(':')
      return `Header always set ${h.slice(0, idx)} "${h.slice(idx + 1).trim()}"`
    }).join('\n')
  }
  return ['/*', ...lines.map((h) => `  ${h}`)].join('\n')
}

function generate(values: Record<string, string | number | boolean>): string {
  const keys = ['hsts', 'xfo', 'nosniff', 'referrer', 'permissions', 'csp'].filter((k) => Boolean(values[k]))
  if (!keys.length) throw new Error('至少选择一个响应头')
  return render(keys, String(values.server))
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: 'CSP 默认策略很保守，接第三方脚本/CDN 时需要自行放行域名',
  resultLabel: '配置片段',
}

export default logic
