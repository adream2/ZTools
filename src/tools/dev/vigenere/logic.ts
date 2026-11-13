import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'text', label: '文本', type: 'textarea' as const, default: 'Hello, World!' },
  { key: 'key', label: '密钥', type: 'text' as const, default: 'KEY', hint: '只用字母，大小写不敏感' },
  {
    key: 'mode',
    label: '方向',
    type: 'select' as const,
    default: 'encode',
    options: [
      { label: '加密', value: 'encode' },
      { label: '解密', value: 'decode' },
    ],
  },
]

export function vigenere(text: string, key: string, decode: boolean): string {
  const clean = key.replace(/[^a-z]/gi, '').toUpperCase()
  if (!clean) throw new Error('密钥至少要包含一个字母')

  let cursor = 0
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0)
      const isUpper = code >= 65 && code <= 90
      const isLower = code >= 97 && code <= 122
      if (!isUpper && !isLower) return ch

      const shift = clean.charCodeAt(cursor % clean.length) - 65
      cursor += 1
      const base = isUpper ? 65 : 97
      const offset = code - base
      const next = decode ? (((offset - shift) % 26) + 26) % 26 : (offset + shift) % 26
      return String.fromCharCode(base + next)
    })
    .join('')
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const text = String(values.text ?? '')
  const key = String(values.key ?? '')
  if (!text.trim()) return [{ label: '结果', value: '请输入文本', emphasis: true }]

  let output = ''
  try {
    output = vigenere(text, key, String(values.mode) === 'decode')
  } catch (e) {
    return [{ label: '结果', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }

  const letters = [...text].filter((c) => /[a-z]/i.test(c)).length

  return [
    { label: '结果', value: output, emphasis: true },
    { label: '参与移位的字母', value: `${letters} 个` },
    { label: '有效密钥', value: key.replace(/[^a-z]/gi, '').toUpperCase() || '—', hint: `长度 ${key.replace(/[^a-z]/gi, '').length}` },
    { label: '密钥循环', value: letters ? `重复约 ${Math.ceil(letters / Math.max(1, key.replace(/[^a-z]/gi, '').length))} 轮` : '—' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '古典密码仅用于练手与解谜，不能用于真实加密',
}

export default logic
