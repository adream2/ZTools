import type { CalcLogic } from '@/components/templates/types'

/** 常见实现的位宽：1 符号 + 41 时间 + 10 机器 + 12 序列 */
export function parseSnowflake(id: string, epoch: number) {
  let value: bigint
  try {
    value = BigInt(id.trim())
  } catch {
    throw new Error('雪花 ID 必须是整数')
  }
  if (value <= 0n) throw new Error('雪花 ID 必须大于 0')

  const sequence = Number(value & 0xfffn)
  const machine = Number((value >> 12n) & 0x3ffn)
  const timestamp = Number((value >> 22n) & 0x1fffffffffffn)
  const date = new Date(epoch + timestamp)

  return { value, sequence, machine, timestamp, date }
}

const EPOCH = 1288834974657 // Twitter 默认 epoch

const FIELDS = [
  { key: 'id', label: '雪花 ID', type: 'text' as const, default: '1234567890123456789' },
  {
    key: 'epoch',
    label: '起始时间戳 epoch',
    type: 'text' as const,
    default: String(EPOCH),
    hint: '毫秒，默认 Twitter 1288834974657',
  },
]

function compute(values: Record<string, string | number>) {
  const raw = String(values.id ?? '').trim()
  if (!raw) return [{ label: '结果', value: '请输入 ID', emphasis: true }]
  const epoch = Number(values.epoch) || EPOCH
  const p = parseSnowflake(raw, epoch)

  return [
    {
      label: '生成时间',
      value: p.date.toLocaleString('zh-CN'),
      emphasis: true,
      hint: `epoch + ${p.timestamp} ms`,
    },
    { label: '机器位', value: String(p.machine), hint: '默认 10 位' },
    { label: '序列号', value: String(p.sequence), hint: '默认 12 位' },
    { label: '二进制', value: p.value.toString(2), hint: `${p.value.toString(2).length} 位` },
    { label: '十六进制', value: p.value.toString(16) },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '不同实现的 epoch 与位宽可能不同，请按后端配置调整起始时间戳',
}

export default logic
