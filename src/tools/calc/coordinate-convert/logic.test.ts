import { describe, expect, it } from 'vitest'
import { convert } from './logic'
import { bearing, haversine } from '../geo-distance/logic'

describe('坐标转换', () => {
  it('境内 WGS84 → GCJ02 有正偏移', () => {
    const [lng, lat] = convert(116.397428, 39.90923, 'wgs84', 'gcj02')
    expect(lng).toBeGreaterThan(116.397)
    expect(lat).toBeGreaterThan(39.909)
  })

  it('往返转换误差在 1 米内', () => {
    const [glng, glat] = convert(116.397428, 39.90923, 'wgs84', 'gcj02')
    const [wlng, wlat] = convert(glng, glat, 'gcj02', 'wgs84')
    expect(haversine(39.90923, 116.397428, wlat, wlng) * 1000).toBeLessThan(1)
  })

  it('境外坐标不偏移', () => {
    expect(convert(-0.1276, 51.5072, 'wgs84', 'gcj02')).toEqual([-0.1276, 51.5072])
  })
})

describe('经纬度距离', () => {
  it('北京到上海约 1067 km', () => {
    const km = haversine(39.90923, 116.397428, 31.23037, 121.473701)
    expect(km).toBeGreaterThan(1050)
    expect(km).toBeLessThan(1085)
  })

  it('正东方向的方位角约 90°', () => {
    expect(Math.round(bearing(0, 0, 0, 1))).toBe(90)
  })
})
