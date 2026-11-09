import type { CalcLogic } from '@/components/templates/types'

export function parseObjectId(id: string) {
  const clean = id.trim().toLowerCase()
  if (!/^[0-9a-f]{24}$/.test(clean)) throw new Error('ObjectId 必须是 24 位十六进制字符串')

  const timeHex = clean.slice(0, 8)
  const machine = clean.slice(8, 14)
  const pid = clean.slice(14, 18)
  const counter = clean.slice(18, 24)
  const seconds = parseInt(timeHex, 16)
  const date = new Date(seconds * 1000)

  return {
    timeHex,
    machine,
    pid,
    counter,
    seconds,
    date,
    pidDec: parseInt(pid, 16),
    counterDec: parseInt(counter, 16),
  }
}

export function generateObjectId(seconds = Math.floor(Date.now() / 1000)): string {
  const time = seconds.toString(16).padStart(8, '0')
  const rest = new Uint8Array(8)
  crypto.getRandomValues(rest)
  return time + Array.from(rest, (b) => b.toString(16).padStart(2, '0')).join('')
}

const FIELDS = [
  { key: 'id', label: 'ObjectId', type: 'text' as const, default: '507f1f77bcf86cd799439011' },
]

function compute(values: Record<string, string | number>) {
  const raw = String(values.id ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入 ObjectId', emphasis: true }]
  const p = parseObjectId(raw)
  return [
    {
      label: '生成时间',
      value: p.date.toLocaleString('zh-CN'),
      emphasis: true,
      hint: `Unix ${p.seconds}`,
    },
    { label: '时间戳段', value: p.timeHex, hint: '前 8 位' },
    { label: '机器标识', value: p.machine, hint: '5 字节随机' },
    { label: '进程 ID', value: `${p.pid} (${p.pidDec})`, hint: '2 字节' },
    { label: '计数器', value: `${p.counter} (${p.counterDec})`, hint: '3 字节自增' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '前 4 字节是创建时间（秒），可据此判断文档写入顺序',
}

export default logic
