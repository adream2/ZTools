import type { CalcLogic, CalcResult } from '@/components/templates/types'

interface Sign {
  name: string
  range: string
  element: string
  ruler: string
  /** 起始日（含），格式 MM-DD */
  start: [number, number]
  startText: string
}

const SIGNS: Sign[] = [
  { name: '摩羯座', range: '12.22 – 1.19', element: '土象', ruler: '土星', start: [12, 22], startText: '12 月 22 日' },
  { name: '水瓶座', range: '1.20 – 2.18', element: '风象', ruler: '天王星', start: [1, 20], startText: '1 月 20 日' },
  { name: '双鱼座', range: '2.19 – 3.20', element: '水象', ruler: '海王星', start: [2, 19], startText: '2 月 19 日' },
  { name: '白羊座', range: '3.21 – 4.19', element: '火象', ruler: '火星', start: [3, 21], startText: '3 月 21 日' },
  { name: '金牛座', range: '4.20 – 5.20', element: '土象', ruler: '金星', start: [4, 20], startText: '4 月 20 日' },
  { name: '双子座', range: '5.21 – 6.21', element: '风象', ruler: '水星', start: [5, 21], startText: '5 月 21 日' },
  { name: '巨蟹座', range: '6.22 – 7.22', element: '水象', ruler: '月亮', start: [6, 22], startText: '6 月 22 日' },
  { name: '狮子座', range: '7.23 – 8.22', element: '火象', ruler: '太阳', start: [7, 23], startText: '7 月 23 日' },
  { name: '处女座', range: '8.23 – 9.22', element: '土象', ruler: '水星', start: [8, 23], startText: '8 月 23 日' },
  { name: '天秤座', range: '9.23 – 10.23', element: '风象', ruler: '金星', start: [9, 23], startText: '9 月 23 日' },
  { name: '天蝎座', range: '10.24 – 11.22', element: '水象', ruler: '冥王星', start: [10, 24], startText: '10 月 24 日' },
  { name: '射手座', range: '11.23 – 12.21', element: '火象', ruler: '木星', start: [11, 23], startText: '11 月 23 日' },
]

const FIELDS = [
  { key: 'date', label: '出生日期', type: 'date' as const, default: '1995-08-20' },
]

/** 各星座起始日（按日历顺序），1 月 20 日起是水瓶座 */
const BOUNDARIES: Array<[number, number]> = [
  [1, 20],
  [2, 19],
  [3, 21],
  [4, 20],
  [5, 21],
  [6, 22],
  [7, 23],
  [8, 23],
  [9, 23],
  [10, 24],
  [11, 23],
  [12, 22],
]

/** 返回该日期所属星座在 SIGNS 里的下标 */
export function signIndex(month: number, day: number): number {
  const value = month * 100 + day
  let idx = 0
  for (let i = 0; i < BOUNDARIES.length; i += 1) {
    const [bm, bd] = BOUNDARIES[i]!
    if (value >= bm * 100 + bd) idx = (i + 1) % 12
  }
  return idx
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(values.date).trim())
  if (!m) return [{ label: '结果', value: '请选择出生日期', emphasis: true }]

  const month = Number(m[2])
  const day = Number(m[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return [{ label: '结果', value: '日期不合法', emphasis: true }]
  }

  const idx = signIndex(month, day)
  const sign = SIGNS[idx]!
  const next = SIGNS[(idx + 1) % SIGNS.length]!

  // 以 2001 年（平年）为基准算「第几天」，跨年时补一年
  const ref = (mm: number, dd: number) => Date.UTC(2001, mm - 1, dd) / 86400000
  let offset = Math.round(ref(month, day) - ref(sign.start[0], sign.start[1]))
  if (offset < 0) offset += 365

  return [
    { label: '星座', value: sign.name, emphasis: true, hint: `${sign.element} · 守护星 ${sign.ruler}` },
    { label: '日期区间', value: sign.range },
    { label: '四象属性', value: sign.element, hint: elementHint(sign.element) },
    { label: '守护星', value: sign.ruler },
    { label: '在本星座第几天', value: `第 ${offset + 1} 天` },
    { label: '下一个星座', value: `${next.name}（${next.startText}起）` },
  ]
}

function elementHint(element: string): string {
  if (element === '火象') return '行动力强、偏直觉'
  if (element === '土象') return '务实、重视结果'
  if (element === '风象') return '重沟通与想法'
  return '情绪与感受优先'
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '太阳星座只按日期推算，不含出生时间与地点',
}

export default logic
