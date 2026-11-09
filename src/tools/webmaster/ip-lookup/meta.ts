import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ip-lookup',
  title: 'IP 查询',
  summary: '查归属地、运营商与 ASN，多个数据源自动切换',
  category: 'webmaster',
  keywords: ['ip', '归属地', 'ip查询', '地理位置', '运营商', 'asn', 'isp', 'whois', '我的ip'],
  privacy: 'network',
  networkHosts: ['ipwho.is', 'ipapi.co', 'api.ipify.org'],
  order: 1,
  tips: [
    'IP 归属地是运营商分配记录的推算结果，城市级精度有限，不能用来定位个人。',
    'CDN 后面的站点查到的往往是 CDN 节点 IP，不是源站。',
    '查自己的公网 IP 直接点「查本机」，不用手动填。',
  ],
})
