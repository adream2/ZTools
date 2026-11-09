import { useRegisterSW } from 'virtual:pwa-register/vue'

const UPDATE_INTERVAL = 60 * 60 * 1000
const ASSET_CACHE = 'zt-assets'

export const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    setInterval(() => void registration.update(), UPDATE_INTERVAL)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void registration.update()
    })
  },
})

export async function applyUpdate(): Promise<void> {
  await updateServiceWorker(true)
}

/**
 * 首次访问时把本页已下载的静态资源主动写进运行时缓存。
 * 否则用户装完就断网会白屏——SW 只接管了后续请求，看不到首屏那批资源。
 */
function warmAssetCache(): void {
  if (!('caches' in window)) return

  const collect = (): string[] =>
    performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => url.startsWith(`${location.origin}/`) && url.includes('/assets/'))

  const warm = async (): Promise<void> => {
    const urls = collect()
    if (!urls.length) return
    try {
      const cache = await caches.open(ASSET_CACHE)
      await Promise.all(
        urls.map(async (url) => {
          const hit = await cache.match(url)
          if (hit) return
          await cache.add(url).catch(() => undefined)
        }),
      )
    } catch {
      /* 缓存失败不影响主流程 */
    }
  }

  if (navigator.serviceWorker?.controller) {
    setTimeout(() => void warm(), 1200)
  } else {
    navigator.serviceWorker?.ready.then(() => setTimeout(() => void warm(), 1200)).catch(() => undefined)
  }

  // 之后每次路由切换补一次，覆盖新打开的工具
  window.addEventListener('load', () => setTimeout(() => void warm(), 3000), { once: true })
}

warmAssetCache()
