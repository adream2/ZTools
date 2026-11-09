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
  type?: 'number' | 'text' | 'select' | 'date'
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
