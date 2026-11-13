import type { CalcLogic, CalcResult } from '@/components/templates/types'

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const STEM_ELEMENT = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']

/** 六十甲子纳音，每两个干支共用一个 */
const NAYIN = [
  '海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火',
  '涧下水', '城头土', '白蜡金', '杨柳木', '泉中水', '屋上土',
  '霹雳火', '松柏木', '长流水', '沙中金', '山下火', '平地木',
  '壁上土', '金箔金', '覆灯火', '天河水', '大驿土', '钗钏金',
  '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水',
]

const FIELDS = [
  { key: 'year', label: '年份（公历）', type: 'number' as const, default: 1995, min: 1900, max: 2100 },
]

/** 公历年 → 干支序号 0–59（以 1984 甲子年为基准） */
function cycleIndex(year: number): number {
  return (((year - 4) % 60) + 60) % 60
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const year = Math.round(Number(values.year))
  if (!Number.isFinite(year) || year < 1900 || year > 2100) {
    return [{ label: '结果', value: '请输入 1900–2100 之间的年份', emphasis: true }]
  }

  const idx = cycleIndex(year)
  const stem = STEMS[idx % 10]!
  const branch = BRANCHES[idx % 12]!
  const animal = ANIMALS[idx % 12]!
  const nayin = NAYIN[Math.floor(idx / 2)]!
  const element = STEM_ELEMENT[idx % 10]!

  const now = new Date().getFullYear()
  const nextBenming = year + Math.ceil((now - year) / 12) * 12

  return [
    { label: '生肖', value: `${animal}年`, emphasis: true, hint: `${stem}${branch}年 · 纳音${nayin}` },
    { label: '干支', value: `${stem}${branch}`, hint: `六十甲子第 ${idx + 1} 位` },
    { label: '天干五行', value: `${stem}${element}`, hint: `天干${stem}属${element}` },
    { label: '纳音五行', value: nayin },
    { label: '本命年', value: `${nextBenming} 年`, hint: nextBenming === now ? '就是今年' : `还有 ${nextBenming - now} 年` },
    { label: '与今年相差', value: `${Math.abs(now - year)} 年${now >= year ? '前' : '后'}出生` },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '公历年按立春换年，1–2 月初出生请以农历年为准',
}

export default logic
