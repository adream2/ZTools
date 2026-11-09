import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'dns-lookup',
  title: 'DNS 查询',
  summary: 'A / AAAA / MX / TXT 等记录，走 DoH 三源备份',
  category: 'webmaster',
  keywords: ['dns', '域名', '解析', '记录', 'a记录', 'mx', 'txt', 'ns', 'cname', 'doh', 'dig'],
  privacy: 'network',
  networkHosts: ['cloudflare-dns.com', 'dns.google', '223.5.5.5'],
  order: 2,
  tips: [
    '刚改过解析时各地缓存还没同步，TTL 内查到旧结果是正常的。',
    '同一域名配多条 A 记录会轮询返回，这是负载均衡，不是解析错误。',
    'NXDOMAIN 表示域名不存在或已过期；SERVFAIL 通常是上游 DNS 出问题，换个源再试。',
  ],
})
