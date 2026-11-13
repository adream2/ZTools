import type { LookupLogic } from '@/components/templates/types'

/** 端口|服务|用途|备注 */
const RAW = `
20|FTP-Data|FTP 数据传输|主动模式下由服务端发起
21|FTP|FTP 控制连接|明文传输，建议换 SFTP
22|SSH|远程登录 / Git over SSH|改端口能减少扫描日志
23|Telnet|明文远程登录|已不推荐使用
25|SMTP|邮件发送|家用宽带常被封
53|DNS|域名解析|UDP 与 TCP 都用
67|DHCP|地址分配（服务端）|广播发现
68|DHCP|地址分配（客户端）|
69|TFTP|简单文件传输|无认证，仅内网
80|HTTP|明文网页|
110|POP3|收邮件（明文）|
123|NTP|时间同步|UDP
135|MS RPC|Windows 远程调用|
137|NetBIOS|Windows 名称服务|UDP
139|NetBIOS|Windows 文件共享|老式
143|IMAP|收邮件（明文）|
161|SNMP|设备监控|UDP
179|BGP|路由协议|运营商之间
389|LDAP|目录服务|636 为加密版
443|HTTPS|加密网页|HTTP/2、HTTP/3 都走这里
445|SMB|Windows 文件共享|公网暴露极易中勒索
465|SMTPS|加密邮件发送|
514|Syslog|日志转发|UDP
587|SMTP|邮件提交（STARTTLS）|
636|LDAPS|加密目录服务|
873|rsync|文件同步|
993|IMAPS|加密收邮件|
995|POP3S|加密收邮件|
1194|OpenVPN|VPN|UDP 为主
1433|MSSQL|微软 SQL Server|
1521|Oracle|Oracle 数据库|
1883|MQTT|物联网消息|8883 为 TLS
2049|NFS|网络文件系统|
2181|ZooKeeper|协调服务|
2375|Docker|Docker API（明文）|公网暴露可被直接控制
2376|Docker|Docker API（TLS）|
3000|Dev|前端 / Nest / Grafana 默认|常被开发服务占用
3306|MySQL|MySQL / MariaDB|
3389|RDP|Windows 远程桌面|爆破重灾区
5000|Dev|Flask / 注册中心默认|
5432|PostgreSQL|PostgreSQL|
5601|Kibana|日志可视化|
5672|RabbitMQ|AMQP|
6379|Redis|缓存 / 队列|默认无密码，务必绑定内网
8080|HTTP-Alt|Tomcat / 反向代理常用|
8443|HTTPS-Alt|备用 HTTPS|
8888|Jupyter|Notebook 默认|
9000|PHP-FPM|FastCGI|也可被 MinIO 使用
9092|Kafka|消息队列|
9200|Elasticsearch|搜索 / 日志|公网裸奔常见
11211|Memcached|内存缓存|UDP 放大攻击源
27017|MongoDB|文档数据库|默认无认证
`

interface Port {
  port: number
  service: string
  use: string
  note: string
}

const PORTS: Port[] = RAW.trim()
  .split('\n')
  .map((line) => {
    const [port, service, use, note] = line.split('|')
    return {
      port: Number(port),
      service: service!.trim(),
      use: use!.trim(),
      note: (note ?? '').trim(),
    }
  })

const logic: LookupLogic = {
  DATASET: PORTS.map((p) => ({
    key: String(p.port),
    title: `${p.port} · ${p.service}`,
    desc: p.use,
    tags: p.port < 1024 ? ['系统端口'] : ['用户端口'],
    rows: [
      { label: '端口', value: String(p.port) },
      { label: '服务', value: p.service },
      { label: '用途', value: p.use },
      { label: '端口段', value: p.port < 1024 ? '0–1023 系统端口' : '1024 以上用户端口' },
      ...(p.note ? [{ label: '备注', value: p.note }] : []),
    ],
  })),
  placeholder: '搜索 3306、redis、邮件',
  note: '仅列常见端口，实际以服务配置文件为准',
}

export default logic
