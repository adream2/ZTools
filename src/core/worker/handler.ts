import type { WorkerProgress, WorkerRequest, WorkerTask } from './protocol'

type PostTarget = { postMessage: (value: unknown) => void }
const scope = self as unknown as PostTarget

function post(msg: unknown): void {
  scope.postMessage(msg)
}

/**
 * Worker 侧的统一派发器。用法：
 *   defineWorkerHandler({ format: (payload, ctx) => {...} })
 */
export function defineWorkerHandler(tasks: Record<string, WorkerTask<never, unknown>>): void {
  self.addEventListener('message', (event) => {
    const { id, type, payload } = (event as MessageEvent<WorkerRequest>).data

    const task = tasks[type]
    if (!task) {
      post({ id, ok: false, error: `未知任务：${type}` })
      return
    }

    const ctx = {
      report: (value: number, label?: string) => post({ id, progress: { value, label } satisfies WorkerProgress }),
    }

    void Promise.resolve()
      .then(() => task(payload as never, ctx))
      .then((result) => post({ id, ok: true, result }))
      .catch((err: unknown) => post({ id, ok: false, error: err instanceof Error ? err.message : String(err) }))
  })
}
