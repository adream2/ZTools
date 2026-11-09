export interface City {
  name: string
  zone: string
  country: string
}

export const CITIES: City[] = [
  { name: '北京', zone: 'Asia/Shanghai', country: '中国' },
  { name: '东京', zone: 'Asia/Tokyo', country: '日本' },
  { name: '新加坡', zone: 'Asia/Singapore', country: '新加坡' },
  { name: '迪拜', zone: 'Asia/Dubai', country: '阿联酋' },
  { name: '伦敦', zone: 'Europe/London', country: '英国' },
  { name: '巴黎', zone: 'Europe/Paris', country: '法国' },
  { name: '纽约', zone: 'America/New_York', country: '美国' },
  { name: '洛杉矶', zone: 'America/Los_Angeles', country: '美国' },
  { name: '悉尼', zone: 'Australia/Sydney', country: '澳大利亚' },
  { name: '圣保罗', zone: 'America/Sao_Paulo', country: '巴西' },
]

export interface CityTime {
  city: City
  time: string
  date: string
  weekday: string
  offset: string
  isNight: boolean
}

export function timeOf(city: City, now = new Date()): CityTime {
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    timeZone: city.zone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
  })

  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]))
  const hour = Number(parts.hour === '24' ? '0' : parts.hour)

  // 计算与本地时差
  const localOffset = -now.getTimezoneOffset() / 60
  const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
  const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.zone }))
  const cityOffset = Math.round((cityTime.getTime() - utcTime.getTime()) / 3600000)
  const diff = cityOffset - localOffset

  return {
    city,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: parts.weekday ?? '',
    offset: diff === 0 ? '与本地相同' : `${diff > 0 ? '+' : ''}${diff} 小时`,
    isNight: hour < 6 || hour >= 19,
  }
}
