import type { CalcLogic } from '@/components/templates/types'

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/

export function parseVersion(text: string): { major: number; minor: number; patch: number; pre: string; build: string } {
  const m = SEMVER.exec(text.trim())
  if (!m) throw new Error(`「${text}」不是合法语义化版本（形如 1.2.3）`)
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    pre: m[4] ?? '',
    build: m[5] ?? '',
  }
}

export function compare(a: string, b: string): number {
  const va = parseVersion(a)
  const vb = parseVersion(b)
  for (const key of ['major', 'minor', 'patch'] as const) {
    if (va[key] !== vb[key]) return va[key] > vb[key] ? 1 : -1
  }
  // 有预发布标识的版本更低
  if (va.pre && !vb.pre) return -1
  if (!va.pre && vb.pre) return 1
  if (va.pre && vb.pre) return va.pre.localeCompare(vb.pre)
  return 0
}

function bump(version: string, type: 'major' | 'minor' | 'patch'): string {
  const v = parseVersion(version)
  if (type === 'major') return `${v.major + 1}.0.0`
  if (type === 'minor') return `${v.major}.${v.minor + 1}.0`
  return `${v.major}.${v.minor}.${v.patch + 1}`
}

const FIELDS = [
  { key: 'a', label: '版本 A', type: 'text' as const, default: '1.2.3', hint: '如 1.2.3 或 2.0.0-beta.1' },
  {
    key: 'op',
    label: '操作',
    type: 'select' as const,
    default: 'compare',
    options: [
      { label: '比较 A 与 B', value: 'compare' },
      { label: '递增 major', value: 'major' },
      { label: '递增 minor', value: 'minor' },
      { label: '递增 patch', value: 'patch' },
      { label: '校验格式', value: 'check' },
    ],
  },
  { key: 'b', label: '版本 B', type: 'text' as const, default: '1.3.0', hint: '只在比较时使用' },
]

function compute(values: Record<string, string | number>) {
  const a = String(values.a ?? '').trim()
  const b = String(values.b ?? '').trim()
  const op = String(values.op)

  if (!a) return [{ label: '结果', value: '请输入版本号', emphasis: true }]

  if (op === 'check') {
    const v = parseVersion(a)
    return [
      { label: '格式', value: '合法', emphasis: true, hint: '符合 SemVer 2.0.0' },
      { label: 'major', value: String(v.major) },
      { label: 'minor', value: String(v.minor) },
      { label: 'patch', value: String(v.patch) },
      { label: '预发布', value: v.pre || '无' },
      { label: '构建信息', value: v.build || '无' },
    ]
  }

  if (op === 'compare') {
    const r = compare(a, b)
    return [
      { label: '比较结果', value: r === 0 ? 'A = B' : r > 0 ? 'A > B' : 'A < B', emphasis: true },
      { label: 'A', value: a },
      { label: 'B', value: b },
    ]
  }

  const next = bump(a, op as 'major' | 'minor' | 'patch')
  return [
    { label: `递增 ${op}`, value: next, emphasis: true },
    { label: '原版本', value: a },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '遵循 SemVer 2.0.0：预发布版本低于同号正式版',
}

export default logic
