import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  {
    key: 'date',
    label: '公历日期',
    type: 'date' as const,
    default: new Date().toISOString().slice(0, 10),
  },
]

interface LunarLib {
  Solar: { fromYmd: (y: number, m: number, d: number) => { getLunar: () => LunarObj } }
}

interface LunarObj {
  toString: () => string
  getYearInGanZhi: () => string
  getMonthInChinese: () => string
  getDayInChinese: () => string
  getYearShengXiao: () => string
  getJieQi: () => string
  getFestivals: () => string[]
}

let lib: LunarLib | null = null

async function loadLib(): Promise<LunarLib> {
  if (lib) return lib
  const mod = (await import('lunar-javascript')) as unknown as LunarLib
  lib = mod
  return mod
}

void loadLib()

function compute(values: Record<string, string | number>): CalcResult[] {
  const raw = String(values.date ?? '').trim()
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!m) return [{ label: '结果', value: '请选择日期', emphasis: true }]
  if (!lib) return [{ label: '词典加载中', value: '请稍后重新选择日期', emphasis: true }]

  try {
    const lunar = lib.Solar.fromYmd(Number(m[1]), Number(m[2]), Number(m[3])).getLunar()
    const festivals = lunar.getFestivals?.() ?? []

    return [
      { label: '农历', value: lunar.toString(), emphasis: true },
      { label: '干支年', value: lunar.getYearInGanZhi() },
      { label: '生肖', value: lunar.getYearShengXiao() },
      { label: '节气', value: lunar.getJieQi() || '当日无节气' },
      { label: '节日', value: festivals.length ? festivals.join('、') : '无' },
    ]
  } catch (e) {
    return [{ label: '转换失败', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '农历以北京时间计算，1900–2100 年范围内准确',
}

export default logic
