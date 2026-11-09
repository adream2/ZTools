import { onScopeDispose, ref, shallowRef } from 'vue'
import { createWorkerClient, type CallOptions } from './client'

export interface UseWorkerTaskOptions extends CallOptions {
  /** 每次运行前重置结果 */
  resetOnRun?: boolean
}

/**
 * 组件内使用 Worker 的便捷封装：
 *   const { run, loading, error, progress, result } = useWorkerTask(loader)
 */
export function useWorkerTask<TOut = unknown>(workerLoader: () => Worker, defaultOptions: UseWorkerTaskOptions = {}) {
  const client = createWorkerClient(workerLoader, defaultOptions.timeout)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)
  const progressLabel = ref('')
  const result = shallowRef<TOut | null>(null)

  async function run<TIn = unknown>(type: string, payload?: TIn, options: CallOptions = {}): Promise<TOut | null> {
    loading.value = true
    error.value = null
    progress.value = 0
    progressLabel.value = ''
    if (defaultOptions.resetOnRun !== false) result.value = null

    try {
      const out = await client.call<TIn, TOut>(type, payload, {
        ...defaultOptions,
        ...options,
        onProgress: (p) => {
          progress.value = p.value
          progressLabel.value = p.label ?? ''
          options.onProgress?.(p)
        },
      })
      result.value = out
      return out
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      return null
    } finally {
      loading.value = false
    }
  }

  function cancel(): void {
    client.terminate()
    loading.value = false
  }

  onScopeDispose(() => client.terminate())

  return { run, cancel, loading, error, progress, progressLabel, result }
}
