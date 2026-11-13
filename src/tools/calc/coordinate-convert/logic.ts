import type { CalcLogic, CalcResult } from '@/components/templates/types'

const PI = Math.PI
const A = 6378245.0
const EE = 0.00669342162296594323

type Pair = [number, number]

const FIELDS = [
  { key: 'lng', label: '经度（lng）', type: 'number' as const, default: 116.397428, step: 0.000001 },
  { key: 'lat', label: '纬度（lat）', type: 'number' as const, default: 39.90923, step: 0.000001 },
  {
    key: 'from',
    label: '原坐标',
    type: 'select' as const,
    default: 'wgs84',
    options: [
      { label: 'WGS84（GPS）', value: 'wgs84' },
      { label: 'GCJ02（高德 / 腾讯）', value: 'gcj02' },
      { label: 'BD09（百度）', value: 'bd09' },
    ],
  },
  {
    key: 'to',
    label: '目标坐标',
    type: 'select' as const,
    default: 'gcj02',
    options: [
      { label: 'WGS84（GPS）', value: 'wgs84' },
      { label: 'GCJ02（高德 / 腾讯）', value: 'gcj02' },
      { label: 'BD09（百度）', value: 'bd09' },
    ],
  },
]

function outOfChina(lng: number, lat: number): boolean {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271
}

function delta(lng: number, lat: number): Pair {
  const x = lng - 105
  const y = lat - 35

  let dLat = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  dLat += ((20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2) / 3
  dLat += ((20 * Math.sin(y * PI) + 40 * Math.sin((y / 3) * PI)) * 2) / 3
  dLat += ((160 * Math.sin((y / 12) * PI) + 320 * Math.sin((y * PI) / 30)) * 2) / 3

  let dLng = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  dLng += ((20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2) / 3
  dLng += ((20 * Math.sin(x * PI) + 40 * Math.sin((x / 3) * PI)) * 2) / 3
  dLng += ((150 * Math.sin((x / 12) * PI) + 300 * Math.sin((x / 30) * PI)) * 2) / 3

  const radLat = (lat / 180) * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)

  dLat = (dLat * 180) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI)
  dLng = (dLng * 180) / ((A / sqrtMagic) * Math.cos(radLat) * PI)
  return [dLng, dLat]
}

function wgs2gcj(lng: number, lat: number): Pair {
  if (outOfChina(lng, lat)) return [lng, lat]
  const [dLng, dLat] = delta(lng, lat)
  return [lng + dLng, lat + dLat]
}

function gcj2wgs(lng: number, lat: number): Pair {
  if (outOfChina(lng, lat)) return [lng, lat]
  let cur: Pair = [lng, lat]
  // 迭代逼近：每轮把误差再算一遍
  for (let i = 0; i < 5; i += 1) {
    const [glng, glat] = wgs2gcj(cur[0], cur[1])
    cur = [cur[0] + (lng - glng), cur[1] + (lat - glat)]
  }
  return cur
}

function bd2gcj(lng: number, lat: number): Pair {
  const x = lng - 0.0065
  const y = lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin((y * PI * 3000) / 180)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos((x * PI * 3000) / 180)
  return [z * Math.cos(theta), z * Math.sin(theta)]
}

function gcj2bd(lng: number, lat: number): Pair {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin((lat * PI * 3000) / 180)
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos((lng * PI * 3000) / 180)
  return [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006]
}

function toGcj(pair: Pair, from: string): Pair {
  if (from === 'wgs84') return wgs2gcj(pair[0], pair[1])
  if (from === 'bd09') return bd2gcj(pair[0], pair[1])
  return pair
}

function fromGcj(pair: Pair, to: string): Pair {
  if (to === 'wgs84') return gcj2wgs(pair[0], pair[1])
  if (to === 'bd09') return gcj2bd(pair[0], pair[1])
  return pair
}

export function convert(lng: number, lat: number, from: string, to: string): Pair {
  const gcj = toGcj([lng, lat], from)
  return fromGcj(gcj, to)
}

const fmt = (n: number): string => n.toFixed(6)

function compute(values: Record<string, string | number>): CalcResult[] {
  const lng = Number(values.lng)
  const lat = Number(values.lat)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return [{ label: '结果', value: '请输入经纬度', emphasis: true }]
  if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    return [{ label: '结果', value: '经度应在 ±180 内，纬度在 ±90 内', emphasis: true }]
  }

  const from = String(values.from)
  const to = String(values.to)
  const [outLng, outLat] = convert(lng, lat, from, to)

  const wgs = fromGcj(toGcj([lng, lat], from), 'wgs84')
  const gcj = toGcj([lng, lat], from)
  const bd = gcj2bd(gcj[0], gcj[1])

  return [
    {
      label: '转换结果',
      value: `${fmt(outLng)}, ${fmt(outLat)}`,
      emphasis: true,
      hint: from === to ? '原坐标与目标相同' : `${from.toUpperCase()} → ${to.toUpperCase()}`,
    },
    { label: 'WGS84', value: `${fmt(wgs[0])}, ${fmt(wgs[1])}` },
    { label: 'GCJ02', value: `${fmt(gcj[0])}, ${fmt(gcj[1])}` },
    { label: 'BD09', value: `${fmt(bd[0])}, ${fmt(bd[1])}` },
    {
      label: '在国境内',
      value: outOfChina(lng, lat) ? '否（不做偏移）' : '是',
      hint: outOfChina(lng, lat) ? '境外坐标三者一致' : 'GCJ02 偏移约 300–600 米',
    },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: 'GCJ02 为国测局加密坐标，逆向换算为迭代逼近结果',
}

export default logic
