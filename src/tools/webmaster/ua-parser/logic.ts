import type { CalcLogic, CalcResult } from '@/components/templates/types'

interface BrowserRule {
  name: string
  re: RegExp
}

const BROWSERS: BrowserRule[] = [
  { name: 'Edge', re: /Edg(?:e|A|iOS)?\/([\d.]+)/ },
  { name: 'Chrome', re: /Chrome\/([\d.]+)/ },
  { name: 'Firefox', re: /Firefox\/([\d.]+)/ },
  { name: 'Safari', re: /Version\/([\d.]+).*Safari/ },
  { name: 'Opera', re: /OPR\/([\d.]+)/ },
  { name: 'IE', re: /MSIE ([\d.]+)/ },
  { name: 'WeChat', re: /MicroMessenger\/([\d.]+)/ },
  { name: 'QQ Browser', re: /QQBrowser\/([\d.]+)/ },
  { name: 'UC', re: /UCBrowser\/([\d.]+)/ },
]

const SYSTEMS: [string, RegExp][] = [
  ['Windows 11', /Windows NT 10\.0.*(Win64|WOW64)/],
  ['Windows 10', /Windows NT 10\.0/],
  ['Windows 8.1', /Windows NT 6\.3/],
  ['Windows 7', /Windows NT 6\.1/],
  ['macOS', /Macintosh; Intel Mac OS X ([\d_.]+)/],
  ['iOS', /(?:iPhone|iPad).*OS ([\d_]+)/],
  ['Android', /Android ([\d.]+)/],
  ['Linux', /Linux/],
  ['ChromeOS', /CrOS/],
]

const BOTS = /bot|crawler|spider|slurp|bingpreview|baiduspider|yandex|headless/i

export function parseUa(ua: string) {
  const browser = BROWSERS.find((b) => b.re.test(ua))
  const browserVersion = browser ? (browser.re.exec(ua)?.[1] ?? '') : ''

  let system = '未知'
  let systemVersion = ''
  for (const [name, re] of SYSTEMS) {
    const m = re.exec(ua)
    if (m) {
      system = name
      systemVersion = (m[1] ?? '').replace(/_/g, '.')
      break
    }
  }

  const isTablet = /iPad|Tablet/i.test(ua)
  const isMobile = !isTablet && /Mobile|iPhone|Android.*Mobile/i.test(ua)
  const isBot = BOTS.test(ua)
  const isWebview = /; wv\)/.test(ua) || /WebView/i.test(ua)

  return {
    browser: browser?.name ?? '未知',
    browserVersion,
    system,
    systemVersion,
    device: isBot ? '爬虫 / 机器人' : isTablet ? '平板' : isMobile ? '手机' : '桌面',
    isMobile,
    isBot,
    isWebview,
    engine: /AppleWebKit/.test(ua) ? 'WebKit' : /Gecko\//.test(ua) ? 'Gecko' : /Trident/.test(ua) ? 'Trident' : '未知',
  }
}

const FIELDS = [
  {
    key: 'ua',
    label: 'User-Agent',
    type: 'text' as const,
    default: navigator.userAgent,
    hint: '默认填当前浏览器',
  },
]

function compute(values: Record<string, string | number>): CalcResult[] {
  const ua = String(values.ua ?? '').trim()
  if (!ua) return [{ label: '结果', value: '请输入 UA', emphasis: true }]
  const p = parseUa(ua)

  return [
    { label: '浏览器', value: p.browserVersion ? `${p.browser} ${p.browserVersion}` : p.browser, emphasis: true },
    { label: '系统', value: p.systemVersion ? `${p.system} ${p.systemVersion}` : p.system },
    { label: '设备', value: p.device },
    { label: '内核', value: p.engine },
    { label: 'WebView', value: p.isWebview ? '是' : '否' },
    { label: '爬虫', value: p.isBot ? '是' : '否' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '基于正则的启发式识别，UA 可伪造，不能用于安全判定',
}

export default logic
