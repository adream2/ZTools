import { DEFAULT_TIMEOUT, type WorkerMessage, type WorkerProgress } from './protocol'

export interface CallOptions {
  transfer?: Transferable[]
  onProgress?: (p: WorkerProgress) => void
  timeout?: number
}

export interface WorkerClient {
  call: <TIn = unknown, TOut = unknown>(type: string, payload?: TIn, options?: CallOptions) => Promise<TOut>
  terminate: () => void
}

interface Pending {
  resolve: (v: unknown) => void
  reject: (e: Error) => void
  timer: ReturnType<typeof setTimeout>
  onProgress?: (p: WorkerProgress) => void
}

/**
 * 极简 RPC：id 关联 Promise + 超时 + 崩溃后自动重建。
 * 不依赖 comlink，行为完全可控。
 */
export function createWorkerClient(factory: () => Worker, defaultTimeout = DEFAULT_TIMEOUT): WorkerClient {
  let worker: Worker | null = null
  let seq = 0
  const pending = new Map<number, Pending>()

  function rejectAll(reason: string): void {
    for (const [, p] of pending) {
      clearTimeout(p.timer)
      p.reject(new Error(reason))
    }
    pending.clear()
  }

  function ensure(): Worker {
    if (worker) return worker
    const w = factory()
    w.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
      const msg = e.data
      const p = pending.get(msg.id)
      if (!p) return
      if ('progress' in msg) {
        p.onProgress?.(msg.progress)
        return
      }
      clearTimeout(p.timer)
      pending.delete(msg.id)
      if (msg.ok) p.resolve(msg.result)
      else p.reject(new Error(msg.error || '任务失败'))
    })
    w.addEventListener('error', (e) => {
      rejectAll(e.message || '计算进程异常')
      w.terminate()
      if (worker === w) worker = null
    })
    worker = w
    return w
  }

  function call<TIn, TOut>(type: string, payload?: TIn, options: CallOptions = {}): Promise<TOut> {
    const w = ensure()
    const id = ++seq
    const timeout = options.timeout ?? defaultTimeout

    return new Promise<TOut>((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id)
        // 超时后销毁 worker：可能已经卡死（如 ReDoS）
        w.terminate()
        if (worker === w) worker = null
        reject(new Error(`计算超时（${Math.round(timeout / 1000)} 秒）`))
      }, timeout)

      pending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer, onProgress: options.onProgress })
      w.postMessage({ id, type, payload }, options.transfer ?? [])
    })
  }

  function terminate(): void {
    rejectAll('已取消')
    worker?.terminate()
    worker = null
  }

  return { call, terminate }
}
