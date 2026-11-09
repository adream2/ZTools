import { Cron } from 'croner'

export interface CronInfo {
  description: string
  runs: Date[]
  valid: boolean
  error?: string
}

export const PRESETS: { label: string; expr: string }[] = [
  { label: '每分钟', expr: '* * * * *' },
  { label: '每 5 分钟', expr: '*/5 * * * *' },
  { label: '每小时整点', expr: '0 * * * *' },
  { label: '每天 0 点', expr: '0 0 * * *' },
  { label: '工作日 9 点', expr: '0 9 * * 1-5' },
  { label: '每月 1 号', expr: '0 0 1 * *' },
]

/** 支持 5 段（分 时 日 月 周）与 croner 的 6 段（含秒） */
export function normalize(expr: string): string {
  return expr.trim().replace(/\s+/g, ' ')
}

export function fieldCount(expr: string): number {
  return normalize(expr).split(' ').length
}

export async function describe(expr: string): Promise<string> {
  const { default: cronstrue } = await import('cronstrue/i18n.js')
  return cronstrue.toString(normalize(expr), { locale: 'zh_CN', throwExceptionOnParseError: true, use24HourTimeFormat: true })
}

export function nextRuns(expr: string, count = 5): Date[] {
  try {
    const job = new Cron(normalize(expr), { paused: true, timezone: undefined })
    return job.nextRuns(count)
  } catch (e) {
    throw new Error(`表达式无效：${e instanceof Error ? e.message : String(e)}`)
  }
}

export async function analyze(expr: string): Promise<CronInfo> {
  const clean = normalize(expr)
  if (!clean) return { description: '', runs: [], valid: false, error: '请输入表达式' }

  try {
    const [description, runs] = await Promise.all([describe(clean), Promise.resolve(nextRuns(clean, 5))])
    return { description, runs, valid: true }
  } catch (e) {
    return { description: '', runs: [], valid: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export function formatRun(d: Date): { date: string; time: string; weekday: string; relative: string } {
  const now = Date.now()
  const diff = d.getTime() - now
  const mins = Math.round(diff / 60000)
  return {
    date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`,
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()] ?? '',
    relative: mins < 60 ? `${mins} 分钟后` : mins < 1440 ? `${Math.round(mins / 60)} 小时后` : `${Math.round(mins / 1440)} 天后`,
  }
}
