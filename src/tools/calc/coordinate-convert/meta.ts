import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'coordinate-convert',
  title: '坐标转换',
  summary: 'WGS84 / 高德 / 百度坐标互转',
  category: 'calc',
  subcategory: '地理',
  keywords: ['坐标', 'gps', 'wgs84', 'gcj02', 'bd09', '经纬度', '火星坐标', '高德', '百度'],
  order: 34,
  kind: 'calc',
  tips: [
    'GPS 设备给的是 WGS84，高德腾讯用 GCJ02（火星坐标），百度在 GCJ02 上又偏了一次。',
    '转换只在国境内生效，境外坐标原样返回；反向换算用迭代逼近，误差在米级以内。',
    '坐标系搞错的典型表现：位置整体偏移 300–600 米，且偏移方向随地区变化。',
  ],
})
