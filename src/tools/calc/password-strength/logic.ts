import type { CalcLogic, CalcResult } from '@/components/templates/types'

const COMMON = ['123456', 'password', 'qwerty', '111111', 'abc123', 'admin', 'letmein', 'iloveyou', 'welcome', 'monkey', 'dragon', '000000']

export function poolSize(pw: string): number {
  let pool = 0
  if (/[a-z]/.test(pw)) pool += 26
  if (/[A-Z]/.test(pw)) pool += 26
  if (/\d/.test(pw)) pool += 10
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33
  return pool
}

export function entropy(pw: string): number {
  const len = [...pw].length
  const pool = poolSize(pw)
  if (!len || !pool) return 0
  let bits = len * Math.log2(pool)
  // 连续重复、纯数字、键盘序列会显著降低实际熵
  if (/(.)\1{2,}/.test(pw)) bits -= 10
  if (/^\d+$/.test(pw)) bits -= 8
  if (/(012|123|234|345|456|567|678|789|abc|qwe|asd|zxc)/i.test(pw)) bits -= 8
  return Math.max(0, bits)
}

const FIELDS = [{ key: 'pw', label: '密码', type: 'text' as const, default: '', hint: '只在本地计算，不会上传' }]

function compute(values: Record<string, string | number>): CalcResult[] {
  const pw = String(values.pw ?? '')
  if (!pw) return [{ label: '结果', value: '输入密码后实时评估', emphasis: true }]

  const bits = entropy(pw)
  const len = [...pw].length
  const lower = /[a-z]/.test(pw)
  const upper = /[A-Z]/.test(pw)
  const digit = /\d/.test(pw)
  const symbol = /[^a-zA-Z0-9]/.test(pw)
  const common = COMMON.some((c) => pw.toLowerCase().includes(c))

  const level = common ? '极弱' : bits >= 100 ? '很强' : bits >= 75 ? '强' : bits >= 50 ? '中等' : '弱'
  const crackTime =
    bits >= 100 ? '数百年以上' : bits >= 75 ? '数十年' : bits >= 50 ? '数天到数月' : bits >= 35 ? '数小时' : '瞬间'

  return [
    { label: '强度', value: level, emphasis: true, hint: `约 ${Math.round(bits)} bit 熵` },
    { label: '暴力破解时间', value: crackTime, hint: '假设每秒 100 亿次离线尝试' },
    { label: '长度', value: `${len} 位` },
    { label: '字符类型', value: [lower && '小写', upper && '大写', digit && '数字', symbol && '符号'].filter(Boolean).join(' + ') || '无' },
    { label: '常见词检测', value: common ? '命中常见弱密码' : '未命中' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '熵是理论上限，真实强度还取决于是否被泄露过；建议用密码管理器生成',
}

export default logic
