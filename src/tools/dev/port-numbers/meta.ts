import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'port-numbers',
  title: '端口号速查',
  summary: '常见服务端口与用途对照',
  category: 'dev',
  subcategory: '参考',
  keywords: ['端口', 'port', '端口号', '3306', '6379', '8080', '443', '防火墙'],
  order: 68,
  kind: 'lookup',
  tips: [
    '1024 以下是系统端口，非 root/管理员不能占用；开发时把服务起在 8080 这类高位端口更省事。',
    '端口开着不等于服务正常：防火墙放行只解决「能不能连」，证书、路径、绑定地址是另外几层问题。',
  ],
})
