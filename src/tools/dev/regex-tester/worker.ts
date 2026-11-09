import { defineWorkerHandler } from '@/core/worker/handler'
import { testRegex, type RegexPayload, type RegexResult } from './logic'

defineWorkerHandler({
  run: (payload: RegexPayload) => testRegex(payload) satisfies RegexResult,
})
