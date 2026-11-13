import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'geo-distance',
  title: '经纬度距离',
  summary: '两点球面距离与方位角',
  category: 'calc',
  subcategory: '地理',
  keywords: ['经纬度', '距离', 'haversine', '方位角', '坐标距离', '地图', '两点'],
  order: 35,
  kind: 'calc',
  tips: [
    '按球面（Haversine）计算，地球按半径 6371 km 的球处理，长距离误差在 0.5% 以内。',
    '需要米级精度时得用椭球模型（Vincenty），但对日常选址、运动轨迹已经绰绰有余。',
  ],
})
