export type Phase = 'focus' | 'short' | 'long'

export const PHASES: Record<Phase, { label: string; minutes: number; color: string }> = {
  focus: { label: '专注', minutes: 25, color: 'var(--c-accent)' },
  short: { label: '短休息', minutes: 5, color: 'var(--c-cat-content)' },
  long: { label: '长休息', minutes: 15, color: 'var(--c-cat-calc)' },
}

export function nextPhase(phase: Phase, completed: number): { phase: Phase; completed: number } {
  if (phase !== 'focus') return { phase: 'focus', completed }
  const done = completed + 1
  return { phase: done % 4 === 0 ? 'long' : 'short', completed: done }
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** 用 WebAudio 合成三声提示音，不依赖音频文件 */
export function chime(times = 3): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0, now + i * 0.35)
      gain.gain.linearRampToValueAtTime(0.22, now + i * 0.35 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + i * 0.35)
      osc.stop(now + i * 0.35 + 0.32)
    }
    setTimeout(() => void ctx.close(), times * 400 + 400)
  } catch {
    /* 静音失败不影响计时 */
  }
}
