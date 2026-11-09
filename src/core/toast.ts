import { ref } from 'vue'

export type ToastType = 'info' | 'ok' | 'error'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

export const toasts = ref<Toast[]>([])
let seq = 0

export function toast(message: string, type: ToastType = 'info', ttl = 2400): void {
  const id = ++seq
  toasts.value = [...toasts.value, { id, message, type }].slice(-4)
  setTimeout(() => dismiss(id), ttl)
}

export function dismiss(id: number): void {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export const toastOk = (m: string) => toast(m, 'ok')
export const toastError = (m: string) => toast(m, 'error', 3600)
