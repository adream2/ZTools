import type { CalcLogic, CalcResult } from '@/components/templates/types'

const R = 6371 // km
const toRad = (deg: number): number => (deg * Math.PI) / 180
const toDeg = (rad: number): number => (rad * 180) / Math.PI

const FIELDS = [
  { key: 'lat1', label: '起点纬度', type: 'number' as const, default: 39.90923, step: 0.000001 },
  { key: 'lng1', label: '起点经度', type: 'number' as const, default: 116.397428, step: 0.000001 },
  { key: 'lat2', label: '终点纬度', type: 'number' as const, default: 31.23037, step: 0.000001 },
  { key: 'lng2', label: '终点经度', type: 'number' as const, default: 121.473701, step: 0.000001 },
]

export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}

export function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1))
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function compass(deg: number): string {
  const dirs = ['正北', '东北', '正东', '东南', '正南', '西南', '正西', '西北']
  return dirs[Math.round(deg / 45) % 8]!
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const lat1 = Number(values.lat1)
  const lng1 = Number(values.lng1)
  const lat2 = Number(values.lat2)
  const lng2 = Number(values.lng2)
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) {
    return [{ label: '结果', value: '请输入两组经纬度', emphasis: true }]
  }
  if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
    return [{ label: '结果', value: '经纬度超出范围', emphasis: true }]
  }

  const km = haversine(lat1, lng1, lat2, lng2)
  const brg = bearing(lat1, lng1, lat2, lng2)
  const midLat = (lat1 + lat2) / 2
  const midLng = (lng1 + lng2) / 2

  // 粗略换算：1 度纬度 ≈ 111 km，经度按纬度收缩
  const dLatKm = Math.abs(lat2 - lat1) * 111
  const dLngKm = Math.abs(lng2 - lng1) * 111 * Math.cos(toRad(midLat))

  return [
    { label: '球面距离', value: `${km.toFixed(3)} km`, emphasis: true, hint: `${Math.round(km * 1000)} 米` },
    { label: '方位角', value: `${brg.toFixed(1)}°`, hint: `${compass(brg)}方向` },
    { label: '南北跨度', value: `${dLatKm.toFixed(1)} km` },
    { label: '东西跨度', value: `${dLngKm.toFixed(1)} km` },
    { label: '中点坐标', value: `${midLat.toFixed(5)}, ${midLng.toFixed(5)}`, hint: '大圆中点近似' },
    {
      label: '步行耗时估算',
      value: km > 0 ? `${(km / 5).toFixed(1)} 小时` : '—',
      hint: '按 5 km/h 平地步行粗估',
    },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '球面模型计算，跨国长距离误差约 0.5%',
}

export default logic
