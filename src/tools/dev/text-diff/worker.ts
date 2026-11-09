import { defineWorkerHandler } from '@/core/worker/handler'
import { computeDiff, type DiffMode } from './logic'

defineWorkerHandler({
  run: (payload: { before: string; after: string; mode: DiffMode }) => computeDiff(payload.before, payload.after, payload.mode),
})
