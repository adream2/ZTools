/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string

declare module 'cronstrue/i18n.js' {
  interface CronstrueOptions {
    locale?: string
    throwExceptionOnParseError?: boolean
    verbose?: boolean
    use24HourTimeFormat?: boolean
    dayOfWeekStartIndexZero?: boolean
  }
  const cronstrue: { toString(expression: string, options?: CronstrueOptions): string }
  export default cronstrue
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
