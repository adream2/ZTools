export interface WorkerRequest<T = unknown> {
  id: number
  type: string
  payload: T
}

export interface WorkerProgress {
  value: number
  label?: string
}

export type WorkerMessage =
  | { id: number; ok: true; result: unknown }
  | { id: number; ok: false; error: string }
  | { id: number; progress: WorkerProgress }

export interface WorkerTaskContext {
  /** 回传进度 0..1，忽略并发压力即可 */
  report: (value: number, label?: string) => void
}

export type WorkerTask<I = unknown, O = unknown> = (payload: I, ctx: WorkerTaskContext) => O | Promise<O>

export const DEFAULT_TIMEOUT = 20_000
