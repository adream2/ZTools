import type { LookupLogic } from '@/components/templates/types'

interface Method {
  name: string
  desc: string
  safe: string
  idempotent: string
  body: string
  codes: string
  use: string
}

const METHODS: Method[] = [
  {
    name: 'GET',
    desc: '获取资源，参数放在 URL 上',
    safe: '是',
    idempotent: '是',
    body: '不应该有',
    codes: '200 / 304 / 404',
    use: '列表、详情、搜索结果；可以被缓存与收藏',
  },
  {
    name: 'HEAD',
    desc: '与 GET 相同但不返回响应体',
    safe: '是',
    idempotent: '是',
    body: '不应该有',
    codes: '200 / 304',
    use: '查文件大小、是否存在、缓存是否新鲜',
  },
  {
    name: 'POST',
    desc: '提交数据，由服务端决定如何处理',
    safe: '否',
    idempotent: '否',
    body: '有',
    codes: '200 / 201 / 400 / 409',
    use: '创建资源、提交表单、触发动作；重复提交会重复执行',
  },
  {
    name: 'PUT',
    desc: '整体替换目标资源',
    safe: '否',
    idempotent: '是',
    body: '有',
    codes: '200 / 201 / 204 / 409',
    use: '带客户端 ID 的创建、整对象更新；传几次结果都一样',
  },
  {
    name: 'PATCH',
    desc: '对资源做局部修改',
    safe: '否',
    idempotent: '通常否',
    body: '有',
    codes: '200 / 204 / 415',
    use: '只改某几个字段；JSON Merge Patch / JSON Patch 两种格式',
  },
  {
    name: 'DELETE',
    desc: '删除目标资源',
    safe: '否',
    idempotent: '是',
    body: '可以没有',
    codes: '200 / 204 / 404',
    use: '删除；第二次调用通常拿到 404，但状态没变，所以仍算幂等',
  },
  {
    name: 'OPTIONS',
    desc: '询问资源支持哪些方法',
    safe: '是',
    idempotent: '是',
    body: '无',
    codes: '200 / 204',
    use: 'CORS 预检请求；返回 Allow 头',
  },
  {
    name: 'TRACE',
    desc: '回显收到的请求，用于诊断',
    safe: '是',
    idempotent: '是',
    body: '无',
    codes: '200 / 405',
    use: '排查代理改写，多数服务器出于 XST 风险直接禁用',
  },
  {
    name: 'CONNECT',
    desc: '建立到目标的隧道',
    safe: '否',
    idempotent: '否',
    body: '无',
    codes: '200',
    use: 'HTTPS 代理；浏览器不会主动发这个请求给业务服务',
  },
]

const logic: LookupLogic = {
  DATASET: METHODS.map((m) => ({
    key: m.name,
    title: m.name,
    desc: m.desc,
    tags: [m.safe === '是' ? '安全方法' : '非安全', m.idempotent === '是' ? '幂等' : '非幂等'],
    rows: [
      { label: '语义', value: m.desc },
      { label: '安全（只读）', value: m.safe },
      { label: '幂等', value: m.idempotent },
      { label: '请求体', value: m.body },
      { label: '常见状态码', value: m.codes },
      { label: '典型用途', value: m.use },
    ],
  })),
  placeholder: '搜索 GET、幂等、CORS',
  note: '安全 = 不修改服务端状态；幂等 = 重复执行结果相同',
}

export default logic
