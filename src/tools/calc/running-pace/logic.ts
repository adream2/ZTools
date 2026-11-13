import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [
  { key: 'distance', label: '距离（km）', type: 'number' as const, default: 5, min: 0.1, step: 0.1 },
  { key: 'duration', label: '用时', type: 'text' as const, default: '30:00', hint: 'mm:ss 或 hh:mm:ss' },
]

export function parseDuration(raw: string): number {
  const parts = String(raw).trim().split(':').map((s) => Number(s))
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) throw new Error('用时格式应为 30:00 或 1:05:00')
  if (parts.length === 1) return parts[0]! * 60
  if (parts.length === 2) return parts[0]! * 60 + parts[1]!
  if (parts.length === 3) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  throw new Error('用时格式应为 30:00 或 1:05:00')
}

export function formatPace(secondsPerKm: number): string {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return '—'
  const total = Math.round(secondsPerKm)
  const min = Math.floor(total / 60)
  const sec = total % 60
  return `${min}′${String(sec).padStart(2, '0')}″`
}

function formatTime(seconds: number): string {
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

const DISTANCES: Array<[string, number]> = [
  ['5 公里', 5],
  ['10 公里', 10],
  ['半程马拉松', 21.0975],
  ['全程马拉松', 42.195],
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const distance = Number(values.distance)
  if (!Number.isFinite(distance) || distance <= 0) return [{ label: '结果', value: '请输入距离', emphasis: true }]

  let seconds = 0
  try {
    seconds = parseDuration(String(values.duration))
  } catch (e) {
    return [{ label: '结果', value: e instanceof Error ? e.message : String(e), emphasis: true }]
  }
  if (seconds <= 0) return [{ label: '结果', value: '用时必须大于 0', emphasis: true }]

  const perKm = seconds / distance
  const speed = distance / (seconds / 3600)

  const rows: CalcResult[] = [
    { label: '配速', value: `${formatPace(perKm)}/km`, emphasis: true, hint: `速度 ${speed.toFixed(2)} km/h` },
    { label: '每 400 米', value: formatPace(perKm * 0.4), hint: '操场一圈' },
    { label: '每小时里程', value: `${speed.toFixed(2)} km` },
  ]

  for (const [label, km] of DISTANCES) {
    rows.push({ label: `按此配速跑${label}`, value: formatTime(perKm * km) })
  }

  return rows
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '按匀速假设推算，含起跑与补水停顿的实际成绩会更慢',
}

export default logic
