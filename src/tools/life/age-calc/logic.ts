import type { CalcLogic, CalcResult } from '@/components/templates/types'

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const FIELDS = [
  { key: 'birth', label: '出生日期', type: 'date' as const, default: '1990-06-15' },
  { key: 'target', label: '计算到哪天', type: 'date' as const, default: today(), hint: '默认今天' },
]

function parse(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim())
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return Number.isNaN(d.getTime()) ? null : d
}

/** 星座按公历日期判定 */
function signOf(month: number, day: number): string {
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座'
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座'
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座'
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座'
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座'
  return '射手座'
}

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function compute(values: Record<string, string | number>): CalcResult[] {
  const birth = parse(String(values.birth))
  const target = parse(String(values.target))
  if (!birth || !target) return [{ label: '结果', value: '请填写完整的出生日期', emphasis: true }]
  if (target < birth) return [{ label: '结果', value: '目标日期早于出生日期', emphasis: true }]

  const bY = birth.getUTCFullYear()
  const bM = birth.getUTCMonth() + 1
  const bD = birth.getUTCDate()
  const tY = target.getUTCFullYear()
  const tM = target.getUTCMonth() + 1
  const tD = target.getUTCDate()

  let full = tY - bY
  if (tM < bM || (tM === bM && tD < bD)) full -= 1
  const nominal = tY - bY + 1
  const days = Math.floor((target.getTime() - birth.getTime()) / 86400000)

  // 下次生日
  const next = new Date(Date.UTC(tY, bM - 1, bD))
  if (next < target) next.setUTCFullYear(tY + 1)
  const daysToBirthday = Math.round((next.getTime() - target.getTime()) / 86400000)

  const animal = ANIMALS[(((bY - 4) % 12) + 12) % 12]
  const stem = STEMS[(((bY - 4) % 10) + 10) % 10]
  const branch = BRANCHES[(((bY - 4) % 12) + 12) % 12]

  return [
    { label: '周岁', value: `${full} 岁`, emphasis: true, hint: `虚岁 ${nominal} 岁 · 生日差 ${daysToBirthday} 天` },
    { label: '已活天数', value: `${days.toLocaleString('zh-CN')} 天`, hint: `约 ${(days / 365.2425).toFixed(1)} 年` },
    { label: '下次生日', value: `${next.getUTCFullYear()}-${String(bM).padStart(2, '0')}-${String(bD).padStart(2, '0')}`, hint: WEEK[next.getUTCDay()] },
    { label: '生肖 / 干支', value: `${animal} · ${stem}${branch}`, hint: `农历年按立春分界，年初出生可能有偏差` },
    { label: '星座', value: signOf(bM, bD) },
    { label: '出生星期', value: WEEK[birth.getUTCDay()] },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '周岁按公历整年计算，虚岁按农历年计算，两者口径不同',
}

export default logic
