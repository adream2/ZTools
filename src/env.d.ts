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

declare module 'spark-md5' {
  interface SparkArrayBuffer {
    append(chunk: ArrayBuffer): void
    end(raw?: boolean): string
  }
  const SparkMD5: {
    ArrayBuffer: {
      new (): SparkArrayBuffer
      hash(data: ArrayBuffer, raw?: boolean): string
    }
  }
  export default SparkMD5
}

declare module 'lunar-javascript' {
  export const Solar: {
    fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): {
      getLunar(): {
        getYearInGanZhi(): string
        getMonthInChinese(): string
        getDayInChinese(): string
        getYearShengXiao(): string
        getJieQi(): string
        toString(): string
      }
      toYmd(): string
    }
  }
  export const Lunar: {
    fromDate(date: Date): {
      getSolar(): { toYmd(): string }
      getYearInGanZhi(): string
    }
  }
}
