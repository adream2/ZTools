import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'nginx301', label: 'Nginx 301', group: 'Nginx' },
  { id: 'nginx302', label: 'Nginx 302', group: 'Nginx' },
  { id: 'htaccess', label: '.htaccess', group: 'Apache' },
  { id: 'edgeone', label: 'EdgeOne JSON', group: '平台' },
]

interface Pair {
  from: string
  to: string
}

function parsePairs(text: string): Pair[] {
  const pairs: Pair[] = []
  for (const line of text.split(/\r?\n/)) {
    const clean = line.trim()
    if (!clean || clean.startsWith('#')) continue
    const parts = clean.split(/[\s,，>→]+/).filter(Boolean)
    if (parts.length < 2) continue
    const from = parts[0]!.startsWith('/') ? parts[0]! : `/${parts[0]}`
    const to = parts[1]!
    pairs.push({ from, to })
  }
  if (!pairs.length) throw new Error('没解析到规则，每行格式：/old /new')
  return pairs
}

function build(text: string, op: string): string {
  const pairs = parsePairs(text)
  const code = op === 'nginx302' ? 302 : 301

  if (op === 'htaccess') {
    return ['RewriteEngine On', ...pairs.map((p) => `Redirect ${code} ${p.from} ${p.to}`)].join('\n')
  }

  if (op === 'edgeone') {
    const json = {
      redirects: pairs.map((p) => ({ source: p.from, destination: p.to, statusCode: code })),
    }
    return JSON.stringify(json, null, 2)
  }

  return pairs
    .map((p) => {
      // 带参数的旧链接：精确匹配 + 保留查询串
      return `location = ${p.from} {\n  return ${code} ${p.to};\n}`
    })
    .join('\n\n')
}

function apply(text: string, op: string): string {
  return build(text, op)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '/old-blog /blog\n/legacy.html /new-page\nhttps://a.com/x /y',
  note: '每行一对「旧路径 新路径」，用空格、逗号或箭头分隔',
  inputLabel: '路径映射',
  outputLabel: '规则',
  noChain: true,
}

export default logic
