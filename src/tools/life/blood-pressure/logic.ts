import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'sbp', label: '收缩压（高压）', type: 'number' as const, default: 128, min: 60, max: 260 },
  { key: 'dbp', label: '舒张压（低压）', type: 'number' as const, default: 82, min: 30, max: 160 },
  {
    key: 'place',
    label: '测量场景',
    type: 'select' as const,
    default: 'clinic',
    options: [
      { label: '诊室测量', value: 'clinic' },
      { label: '家庭自测', value: 'home' },
    ],
  },
]

interface Level {
  name: string
  hint: string
  advice: string
}

function classify(sbp: number, dbp: number, home: boolean): Level {
  const high = home ? 135 : 140
  const high2 = home ? 145 : 160
  const high3 = home ? 155 : 180
  const low2 = home ? 95 : 100
  const low3 = home ? 105 : 110

  if (sbp < 90 || dbp < 60) {
    return { name: '偏低', hint: `低于 ${home ? '90/60' : '90/60'}`, advice: '若有头晕乏力，补充水分并就医排查' }
  }
  if (sbp >= high3 || dbp >= low3) {
    return { name: '3 级高血压', hint: `≥ ${home ? '155/105' : '180/110'}`, advice: '尽快就医，不要自行调整用药' }
  }
  if (sbp >= high2 || dbp >= low2) {
    return { name: '2 级高血压', hint: `≥ ${home ? '145/95' : '160/100'}`, advice: '建议近期就诊，评估靶器官损害' }
  }
  if (sbp >= high || dbp >= (home ? 85 : 90)) {
    return {
      name: '1 级高血压',
      hint: `≥ ${home ? '135/85' : '140/90'}`,
      advice: '先做生活方式干预，同时找医生确认是否需要用药',
    }
  }
  if (sbp >= 120 || dbp >= 80) {
    return { name: '正常高值', hint: '120–139 / 80–89', advice: '控盐、减重、规律运动，每半年复测' }
  }
  return { name: '正常', hint: '< 120 / 80', advice: '保持现有生活方式，年度体检即可' }
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const sbp = Math.round(Number(values.sbp))
  const dbp = Math.round(Number(values.dbp))
  if (!Number.isFinite(sbp) || !Number.isFinite(dbp)) return [{ label: '结果', value: '请输入收缩压与舒张压', emphasis: true }]
  if (sbp <= dbp) return [{ label: '结果', value: '收缩压应大于舒张压，检查是否填反了', emphasis: true }]

  const home = String(values.place) === 'home'
  const level = classify(sbp, dbp, home)
  const pulse = sbp - dbp

  const rows: CalcResult[] = [
    { label: '分级', value: level.name, emphasis: true, hint: `${sbp}/${dbp} mmHg · ${level.hint}` },
    { label: '建议', value: level.advice },
    { label: '脉压差', value: `${pulse} mmHg`, hint: pulse > 60 ? '偏大，留意动脉硬化风险' : pulse < 30 ? '偏小' : '正常范围 30–60' },
    { label: '平均动脉压', value: `${Math.round((sbp + 2 * dbp) / 3)} mmHg`, hint: '约 (收缩压 + 2×舒张压) / 3' },
  ]

  if (sbp >= 140 && dbp < 90) {
    rows.push({ label: '补充判断', value: '单纯收缩期高血压', hint: '老年人常见，高压高但低压不高' })
  }

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '分级依据中国高血压防治指南，仅作参考，不构成诊断',
}

export default logic
