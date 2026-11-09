import { diffLines, diffWordsWithSpace } from 'diff'

export type DiffMode = 'line' | 'word'

export interface DiffLine {
  kind: 'add' | 'del' | 'same'
  text: string
  before: number | null
  after: number | null
}

export interface DiffFragment {
  kind: 'add' | 'del' | 'same'
  text: string
}

export interface DiffResult {
  mode: DiffMode
  lines: DiffLine[]
  fragments: DiffFragment[]
  added: number
  removed: number
  unchanged: number
}

export const MAX_INPUT = 4 * 1024 * 1024

export function computeDiff(before: string, after: string, mode: DiffMode): DiffResult {
  if (mode === 'line') {
    const changes = diffLines(before, after)
    const lines: DiffLine[] = []
    let b = 1
    let a = 1
    let added = 0
    let removed = 0
    let unchanged = 0

    for (const change of changes) {
      const chunks = change.value.split('\n')
      if (chunks[chunks.length - 1] === '') chunks.pop()

      for (const raw of chunks) {
        if (change.added) {
          lines.push({ kind: 'add', text: raw, before: null, after: a++ })
          added++
        } else if (change.removed) {
          lines.push({ kind: 'del', text: raw, before: b++, after: null })
          removed++
        } else {
          lines.push({ kind: 'same', text: raw, before: b++, after: a++ })
          unchanged++
        }
      }
    }

    return { mode, lines, fragments: [], added, removed, unchanged }
  }

  const parts = diffWordsWithSpace(before, after)
  const fragments: DiffFragment[] = parts.map((p) => ({
    kind: p.added ? 'add' : p.removed ? 'del' : 'same',
    text: p.value,
  }))

  return { mode, lines: [], fragments, added: 0, removed: 0, unchanged: 0 }
}

export function changeRatio(result: DiffResult): number {
  if (result.mode === 'line') {
    const total = result.added + result.removed + result.unchanged
    return total ? Math.round(((result.added + result.removed) / total) * 100) : 0
  }
  const total = result.fragments.reduce((n, f) => n + f.text.length, 0)
  const changed = result.fragments.filter((f) => f.kind !== 'same').reduce((n, f) => n + f.text.length, 0)
  return total ? Math.round((changed / total) * 100) : 0
}
