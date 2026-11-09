import type { GeneratorLogic } from '@/components/templates/types'

const SURNAMES = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜'
const GIVEN = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明', '超', '秀英', '桂英', '建华']
const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆', '苏州', '天津']
const DISTRICTS = ['朝阳区', '海淀区', '西湖区', '天河区', '锦江区', '雁塔区', '鼓楼区', '渝北区']
const STREETS = ['中山路', '人民路', '建设大道', '科技园路', '文化街', '解放路', '长江路']
const COMPANIES = ['网络科技', '信息技术', '文化传媒', '电子商务', '智能科技', '数据服务']
const DOMAINS = ['example.com', 'test.dev', 'mock.io', 'demo.cn']

const pick = <T,>(arr: T[] | string): T | string => {
  const list = Array.isArray(arr) ? arr : [...arr]
  return list[Math.floor(Math.random() * list.length)]!
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function name(): string {
  const surname = pick(SURNAMES) as string
  const given = Array.from({ length: rand(1, 2) }, () => pick(GIVEN) as string).join('')
  return surname + given
}

function phone(): string {
  const prefix = pick(['138', '139', '150', '151', '158', '186', '188', '133', '176']) as string
  return prefix + String(rand(0, 99999999)).padStart(8, '0')
}

function email(): string {
  const user = Math.random().toString(36).slice(2, 9)
  return `${user}@${pick(DOMAINS)}`
}

function address(): string {
  return `${pick(CITIES)}市${pick(DISTRICTS)}${pick(STREETS)}${rand(1, 999)}号`
}

function company(): string {
  return `${pick(CITIES)}${pick(COMPANIES)}有限公司`
}

function idCard(): string {
  const area = '110105'
  const year = rand(1970, 2005)
  const month = String(rand(1, 12)).padStart(2, '0')
  const day = String(rand(1, 28)).padStart(2, '0')
  const seq = String(rand(1, 999)).padStart(3, '0')
  const body = `${area}${year}${month}${day}${seq}`
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const sum = [...body].reduce((acc, ch, i) => acc + Number(ch) * (weights[i] ?? 0), 0)
  const check = '10X98765432'[sum % 11]
  return body + check
}

const MAKERS: Record<string, () => string> = {
  name,
  phone,
  email,
  address,
  company,
  'id-card': idCard,
  uuid: () => crypto.randomUUID(),
  date: () => {
    const d = new Date(Date.now() - rand(0, 365 * 5) * 86400000)
    return d.toISOString().slice(0, 10)
  },
  number: () => String(rand(1, 100000)),
  url: () => `https://${pick(DOMAINS)}/${Math.random().toString(36).slice(2, 8)}`,
}

const FIELDS = [
  {
    key: 'type',
    label: '数据类型',
    type: 'select' as const,
    default: 'name',
    options: [
      { label: '姓名', value: 'name' },
      { label: '手机号', value: 'phone' },
      { label: '邮箱', value: 'email' },
      { label: '地址', value: 'address' },
      { label: '公司', value: 'company' },
      { label: '身份证号', value: 'id-card' },
      { label: 'UUID', value: 'uuid' },
      { label: '日期', value: 'date' },
      { label: '数字', value: 'number' },
      { label: '网址', value: 'url' },
    ],
  },
  { key: 'count', label: '数量', type: 'number' as const, default: 10, min: 1, max: 500 },
  { key: 'unique', label: '去重', type: 'switch' as const, default: true },
]

function generate(values: Record<string, string | number | boolean>): string[] {
  const type = String(values.type)
  const count = Math.min(500, Math.max(1, Number(values.count) || 1))
  const maker = MAKERS[type]
  if (!maker) throw new Error('未知数据类型')

  const out = new Set<string>()
  let guard = 0
  while (out.size < count && guard < count * 20) {
    out.add(maker())
    guard++
  }
  return [...out]
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '数据为随机生成，仅用于开发测试，不对应真实个人',
  resultLabel: '生成结果',
}

export default logic
