export type HashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export const ALGOS: { id: HashAlgo; label: string; weak?: boolean }[] = [
  { id: 'MD5', label: 'MD5', weak: true },
  { id: 'SHA-1', label: 'SHA-1', weak: true },
  { id: 'SHA-256', label: 'SHA-256' },
  { id: 'SHA-384', label: 'SHA-384' },
  { id: 'SHA-512', label: 'SHA-512' },
]

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('')
}

async function md5(data: ArrayBuffer): Promise<string> {
  const { default: SparkMD5 } = await import('spark-md5')
  return SparkMD5.ArrayBuffer.hash(data)
}

export async function hashBuffer(data: ArrayBuffer, algo: HashAlgo): Promise<string> {
  if (algo === 'MD5') return md5(data)
  const digest = await crypto.subtle.digest(algo, data)
  return toHex(digest)
}

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  return hashBuffer(new TextEncoder().encode(text).buffer as ArrayBuffer, algo)
}

export async function hashTextAll(text: string): Promise<Record<HashAlgo, string>> {
  const data = new TextEncoder().encode(text).buffer as ArrayBuffer
  const entries = await Promise.all(ALGOS.map(async (a) => [a.id, await hashBuffer(data, a.id)] as const))
  return Object.fromEntries(entries) as Record<HashAlgo, string>
}

/** 分块读取大文件，避免一次性把整个文件读进内存 */
export async function hashFile(file: File, algo: HashAlgo, onProgress?: (p: number) => void): Promise<string> {
  const CHUNK = 4 * 1024 * 1024

  if (algo === 'MD5') {
    const { default: SparkMD5 } = await import('spark-md5')
    const spark = new SparkMD5.ArrayBuffer()
    let offset = 0
    while (offset < file.size) {
      const slice = file.slice(offset, offset + CHUNK)
      spark.append(await slice.arrayBuffer())
      offset += CHUNK
      onProgress?.(Math.min(1, offset / file.size))
    }
    return spark.end()
  }

  // SubtleCrypto 不支持流式，只能整体读入；超过阈值提示
  const buf = await file.arrayBuffer()
  onProgress?.(1)
  const digest = await crypto.subtle.digest(algo, buf)
  return toHex(digest)
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}
