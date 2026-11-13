import type { GeneratorLogic } from '@/components/templates/types'

interface Rule {
  name: string
  re: RegExp
  note: string
}

/** 顺序敏感：越具体的规则放越前面 */
const RULES: Rule[] = [
  { name: '顺丰速运', re: /^SF\d{10,15}$/i, note: 'SF 前缀' },
  { name: '京东物流', re: /^JD[A-Z]?\d{8,15}$/i, note: 'JD 前缀' },
  { name: '圆通速递', re: /^YT\d{10,15}$/i, note: 'YT 前缀' },
  { name: '极兔速递', re: /^JT\d{10,15}$/i, note: 'JT 前缀' },
  { name: '德邦快递', re: /^DPK\d{8,15}$/i, note: 'DPK 前缀' },
  { name: '中国邮政 EMS', re: /^E[A-Z]\d{9}CN$/i, note: 'E 开头、CN 结尾' },
  { name: '邮政国际包裹', re: /^[A-Z]{2}\d{9}CN$/i, note: '两字母 + 9 位 + CN' },
  { name: '中通快递', re: /^7\d{11,13}$/, note: '7 开头纯数字' },
  { name: '韵达速递', re: /^[34]\d{11,13}$/, note: '3 / 4 开头纯数字' },
  { name: '申通快递', re: /^(77|88|66)\d{10,13}$/, note: '77 / 88 / 66 开头' },
  { name: '丰网速运', re: /^FW\d{10,15}$/i, note: 'FW 前缀' },
  { name: '菜鸟裹裹', re: /^CN\d{10,15}$/i, note: 'CN 前缀' },
]

function detect(raw: string): string {
  const code = raw.replace(/[\s-]/g, '').toUpperCase()
  if (!code) return ''
  for (const rule of RULES) {
    if (rule.re.test(code)) return `${code} → ${rule.name}（${rule.note}）`
  }
  if (/^\d{12,15}$/.test(code)) return `${code} → 无法确定（12–15 位纯数字，中通/韵达/申通/邮政都可能）`
  if (/^\d{10}$/.test(code)) return `${code} → 无法确定（10 位纯数字，多见于邮政小包）`
  return `${code} → 未识别，可能是小众快递或输入有误`
}

const FIELDS = [
  {
    key: 'codes',
    label: '运单号（一行一个）',
    type: 'textarea' as const,
    default: 'SF1234567890123\n789012345678\nJD0123456789',
    hint: '空格与横杠会自动去掉',
  },
]

const logic: GeneratorLogic = {
  FIELDS,
  generate: (values) => {
    const text = String(values.codes ?? '')
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(detect)
      .filter(Boolean)
  },
  resultLabel: '识别结果',
  note: '仅按单号格式判断，不查询物流状态',
}

export default logic
