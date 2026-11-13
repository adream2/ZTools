export interface TextOpDef {
  id: string
  label: string
  group?: string
}

/** kind: 'text-op' 的工具在 logic.ts 里导出这些 */
export interface TextOpLogic {
  OPS: TextOpDef[]
  apply: (text: string, op: string) => string
  sample?: string
  inputLabel?: string
  outputLabel?: string
  note?: string
  autoRun?: boolean
  noChain?: boolean
}

export interface GeneratorField {
  key: string
  label: string
  type?: 'text' | 'number' | 'select' | 'switch' | 'textarea'
  placeholder?: string
  hint?: string
  default?: string | number | boolean
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
}

export interface GeneratorLogic {
  FIELDS: GeneratorField[]
  generate: (values: Record<string, string | number | boolean>) => string | string[] | { label: string; value: string }[]
  note?: string
  /** 结果按行展示时的标题 */
  resultLabel?: string
}

export interface LookupItem {
  key: string
  title: string
  desc?: string
  tags?: string[]
  rows?: { label: string; value: string }[]
}

export interface LookupLogic {
  DATASET: LookupItem[]
  placeholder?: string
  note?: string
  /** 搜索匹配的额外字段 */
  searchKeys?: string[]
}

export interface CalcField {
  key: string
  label: string
  type?: 'number' | 'text' | 'select' | 'date' | 'textarea' | 'switch'
  default?: string | number
  suffix?: string
  hint?: string
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
}

export interface CalcResult {
  label: string
  value: string
  hint?: string
  emphasis?: boolean
}

export interface CalcLogic {
  FIELDS: CalcField[]
  compute: (values: Record<string, string | number>) => CalcResult[] | string
  note?: string
}

/* ---------- file-op：文件进、文件 / 文本出 ---------- */

export interface FileOpField {
  key: string
  label: string
  type?: 'number' | 'text' | 'select' | 'switch' | 'color'
  default?: string | number | boolean
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
  hint?: string
  suffix?: string
}

export interface FileOpOutput {
  /** 下载文件名，含扩展名 */
  name: string
  /** 二进制结果，导出文件时用 */
  blob?: Blob
  /** 纯文本结果，例如哈希、元信息 */
  text?: string
  /** 结果卡片上的一行补充说明 */
  meta?: string
}

export interface FileOpLogic {
  /** 文件选择器的 accept，如 image/png */
  accept: string
  multiple?: boolean
  maxSize?: number
  fields?: FileOpField[]
  run: (files: File[], values: Record<string, string | number | boolean>) => Promise<FileOpOutput[]>
  note?: string
  /** 拖拽区提示文案 */
  dropHint?: string
  /** 主按钮文案，默认「开始处理」 */
  actionLabel?: string
  /** 选中文件后立即处理 */
  autoRun?: boolean
}
