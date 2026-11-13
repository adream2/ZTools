import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'text',
    label: '文本（一行一条）',
    type: 'textarea' as const,
    default: '姓名：张三\nname: Zhang San\n备注：测试 emoji 😀',
  },
  { key: 'limit', label: '每行宽度上限', type: 'number' as const, default: 40, min: 1, max: 400 },
]

/** 东亚宽字符与 emoji 占 2 格 */
export function charWidth(cp: number): number {
  if (cp === 0x200b || cp === 0x200d || cp === 0xfe0f) return 0
  if (
    (cp >= 0x1100 && cp <= 0x115f) ||
    (cp >= 0x2e80 && cp <= 0x303e) ||
    (cp >= 0x3041 && cp <= 0x33ff) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0xa000 && cp <= 0xa4cf) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe10 && cp <= 0xfe19) ||
    (cp >= 0xfe30 && cp <= 0xfe6f) ||
    (cp >= 0xff00 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6) ||
    (cp >= 0x1f300 && cp <= 0x1faff) ||
    (cp >= 0x1f000 && cp <= 0x1f02f) ||
    (cp >= 0x20000 && cp <= 0x3fffd)
  ) {
    return 2
  }
  return 1
}

export function displayWidth(text: string): number {
  let width = 0
  for (const ch of text) width += charWidth(ch.codePointAt(0) ?? 0)
  return width
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const text = String(values.text ?? '')
  const limit = Math.max(1, Math.round(Number(values.limit)) || 40)
  const lines = text.split(/\r?\n/)

  const widths = lines.map((line) => displayWidth(line))
  const widest = Math.max(...widths, 0)
  const widestIndex = widths.indexOf(widest)
  const over = widths
    .map((w, i) => ({ w, i }))
    .filter((item) => item.w > limit)
    .map((item) => `第 ${item.i + 1} 行（${item.w}）`)

  const totalChars = [...text].length
  const bytes = new TextEncoder().encode(text).length

  return [
    {
      label: '最宽一行',
      value: `${widest} 格`,
      emphasis: true,
      hint: widestIndex >= 0 ? `第 ${widestIndex + 1} 行` : undefined,
    },
    { label: '超限行数', value: `${over.length} 行`, hint: over.length ? over.slice(0, 6).join('、') : `上限 ${limit} 格` },
    { label: '行数 / 平均宽度', value: `${lines.length} 行 / ${(widths.reduce((a, b) => a + b, 0) / Math.max(1, lines.length)).toFixed(1)} 格` },
    { label: '字符数 / 字节数', value: `${totalChars} / ${bytes}`, hint: '字节按 UTF-8 计' },
    {
      label: '对齐建议',
      value: over.length ? `超限 ${over.length} 行，缩到 ${limit} 格内` : `统一补到 ${widest} 格即可对齐`,
      hint: '按最宽行补空格',
    },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '宽度按东亚宽字符标准估算，不同字体的实际显示可能有差异',
}

export default logic
