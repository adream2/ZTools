import { defineWorkerHandler } from '@/core/worker/handler'
import { formatJson, jsonStats, sortDeep, parseJson, type FormatOptions } from './logic'

export interface JsonTaskPayload {
  text: string
  action: 'format' | 'minify' | 'stats'
  options: FormatOptions
}

defineWorkerHandler({
  run: (payload: JsonTaskPayload) => {
    if (payload.action === 'format') {
      return { output: formatJson(payload.text, payload.options), stats: jsonStats(payload.text) }
    }
    if (payload.action === 'minify') {
      const parsed = parseJson(payload.text)
      return { output: JSON.stringify(parsed), stats: jsonStats(payload.text) }
    }
    return { output: '', stats: jsonStats(payload.text) }
  },
  sort: (payload: { text: string }) => sortDeep(parseJson(payload.text)),
})
