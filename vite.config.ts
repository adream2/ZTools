import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

/** 站长验证平台的 meta name 映射 */
const VERIFY_META: Record<string, string> = {
  VITE_VERIFY_GOOGLE: 'google-site-verification',
  VITE_VERIFY_BING: 'msvalidate.01',
  VITE_VERIFY_BAIDU: 'baidu-site-verification',
  VITE_VERIFY_SOGOU: 'sogou_site_verification',
  VITE_VERIFY_360: '360-site-verification',
  VITE_VERIFY_YANDEX: 'yandex-verification',
}

/**
 * 在构建时把站长验证 meta 与 AdSense 脚本注入 index.html，
 * 并在 dist 里生成 ads.txt。全部由环境变量驱动，未配置就什么都不做。
 */
function siteInject(env: Record<string, string>): Plugin {
  const metas = Object.entries(VERIFY_META)
    .map(([key, name]) => {
      const value = env[key]?.trim()
      return value ? `<meta name="${name}" content="${value}" />` : ''
    })
    .filter(Boolean)

  const client = env.VITE_ADSENSE_CLIENT?.trim() ?? ''
  const adsense = client
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`
    : ''

  return {
    name: 'zt-site-inject',
    transformIndexHtml(html) {
      // 启用广告后，静态文案里的「无广告」需要改成中性表述
      const patched = client ? html.replaceAll('无广告', '免费使用') : html
      return patched
        .replace('<!--site-verify-->', metas.join('\n    '))
        .replace('<!--adsense-->', adsense)
    },
    closeBundle() {
      if (!client) {
        // 未启用广告时删掉 public 里的占位 ads.txt，避免线上出现假的授权记录
        try {
          rmSync(join('dist', 'ads.txt'), { force: true })
        } catch {
          /* 忽略 */
        }
        return
      }
      const pubId = client.replace(/^ca-/, '')
      try {
        mkdirSync('dist', { recursive: true })
        writeFileSync(join('dist', 'ads.txt'), `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`, 'utf8')

        // llms.txt 是静态文件，同样要跟着广告开关调整措辞
        const llmsPath = join('dist', 'llms.txt')
        writeFileSync(llmsPath, readFileSync(llmsPath, 'utf8').replaceAll('无广告', '免费使用'), 'utf8')
      } catch {
        /* 构建产物目录不可写时忽略 */
      }
    },
  }
}

function gitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return 'nogit'
  }
}

/**
 * 把 '/' | '/WebTools' | 'WebTools' | '' 统一成带首尾斜杠的 base。
 * 唯一的 base 来源：Vite base、Router、PWA scope、manifest 全部由它派生。
 */
export function normalizeBase(raw?: string): string {
  const v = (raw ?? '').trim()
  if (!v || v === '/') return '/'
  const withLead = v.startsWith('/') ? v : `/${v}`
  return withLead.endsWith('/') ? withLead : `${withLead}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBase(env.VITE_BASE || process.env.VITE_BASE)

  return {
    base,
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      __APP_VERSION__: JSON.stringify(`${pkg.version}+${gitSha()}`),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
    plugins: [
      siteInject(env),
      vue(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: null,
        base,
        scope: base,
        includeAssets: ['favicon.svg', 'robots.txt'],
        manifest: {
          id: base,
          name: 'ZT 工具箱',
          short_name: '工具箱',
          description: '纯本地运行的中文在线工具箱，开发调试、站长网络、内容创作、计算换算。',
          start_url: base,
          scope: base,
          display: 'standalone',
          orientation: 'any',
          background_color: '#ffffff',
          theme_color: '#2f6bff',
          lang: 'zh-CN',
          dir: 'ltr',
          categories: ['utilities', 'developer', 'productivity'],
          icons: [
            { src: `${base}icons/pwa-192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${base}icons/pwa-512.png`, sizes: '512x512', type: 'image/png' },
            { src: `${base}icons/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            { src: `${base}favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
          ],
        },
        workbox: {
          // 只预缓存应用外壳（~210KB）；工具 chunk 与共享组件由运行时缓存 + 首访预热补齐
          globPatterns: [
            'index.html',
            'manifest.webmanifest',
            'favicon.svg',
            'icons/*.png',
            'assets/index-*.{js,css}',
            'assets/vendor-vue-*.js',
          ],
          globIgnores: ['**/*.map'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: `${base}index.html`,
          navigateFallbackDenylist: [/\.(png|jpe?g|svg|woff2?)$/],
          cleanupOutdatedCaches: true,
          skipWaiting: false,
          // 首次安装后立即接管，否则本次会话的请求不经过 SW，工具 chunk 不会被缓存
          clientsClaim: true,
          runtimeCaching: [
            {
              // 带 hash 的静态资源永不变化，用过即缓存（工具 chunk 走这里）
              urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.includes('/assets/'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'zt-assets',
                expiration: { maxEntries: 220, maxAgeSeconds: 60 * 60 * 24 * 60 },
              },
            },
            {
              urlPattern: /\.woff2?$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'zt-fonts',
                expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              // 第三方接口永不缓存：避免隐私数据落盘与过期结果
              urlPattern: ({ url }) => url.origin !== self.location.origin,
              handler: 'NetworkOnly',
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    worker: { format: 'es' },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // 只把框架单独拆出来保证首屏缓存稳定，其余交给 Rolldown 按动态导入自动分包
            if (!id.includes('node_modules')) return
            if (/[\\/]node_modules[\\/](vue|vue-router|@vue[\\/])/.test(id)) return 'vendor-vue'
          },
        },
      },
    },
    server: { host: true, port: 5173 },
  }
})
