import type { TextOpLogic } from '@/components/templates/types'

function formatDate(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function toDate(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const raw = line.trim()
      if (!raw) return ''
      const num = Number(raw)
      if (Number.isFinite(num) && /^-?\d+(\.\d+)?$/.test(raw)) {
        const ms = Math.abs(num) > 1e11 ? num : num * 1000
        const d = new Date(ms)
        if (Number.isNaN(d.getTime())) return `${raw} → 超出范围`
        return `${raw} → ${formatDate(ms)}`
      }
      const parsed = new Date(raw.replace(' ', 'T'))
      if (Number.isNaN(parsed.getTime())) return `${raw} → 无法解析`
      return `${raw} → ${formatDate(parsed.getTime())}`
    })
    .join('\n')
}

function toTimestamp(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const raw = line.trim()
      if (!raw) return ''
      const parsed = new Date(raw.replace(' ', 'T'))
      if (Number.isNaN(parsed.getTime())) return `${raw} → 无法解析`
      const ms = parsed.getTime()
      return `${raw} → ${Math.floor(ms / 1000)}（秒） / ${ms}（毫秒）`
    })
    .join('\n')
}

const logic: TextOpLogic = {
  OPS: [
    { id: 'to-date', label: '时间戳 → 日期', group: '转换' },
    { id: 'to-ts', label: '日期 → 时间戳', group: '转换' },
  ],
  apply: (text, op) => (op === 'to-date' ? toDate(text) : toTimestamp(text)),
  sample: '1731400000\n1731400000000\n2026-11-13 10:00:00',
  inputLabel: '输入（一行一个）',
  outputLabel: '结果',
  autoRun: true,
}

export default logic
