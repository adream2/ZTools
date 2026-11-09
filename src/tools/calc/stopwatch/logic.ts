export interface Lap {
  index: number
  total: number
  split: number
}

export function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms))
  const m = Math.floor(total / 60000)
  const s = Math.floor((total % 60000) / 1000)
  const cs = Math.floor((total % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function lapStats(laps: Lap[]): { best: number; worst: number; average: number } | null {
  if (!laps.length) return null
  const splits = laps.map((l) => l.split)
  const best = Math.min(...splits)
  const worst = Math.max(...splits)
  const average = splits.reduce((a, b) => a + b, 0) / splits.length
  return { best, worst, average }
}
