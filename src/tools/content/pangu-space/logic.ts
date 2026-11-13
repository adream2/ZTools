import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'space', label: '加空格', group: '处理' },
  { id: 'remove', label: '去多余空格', group: '处理' },
  { id: 'punct', label: '标点转全角', group: '处理' },
]

const CJK = '\u4e00-\u9fa5\u3040-\u30ff'
const WORD = 'A-Za-z0-9@#$%&*+=|~^`'

export function addSpacing(text: string): string {
  return text
    .replace(new RegExp(`([${CJK}])([${WORD}])`, 'g'), '$1 $2')
    .replace(new RegExp(`([${WORD}])([${CJK}])`, 'g'), '$1 $2')
    .replace(new RegExp(`([${CJK}])([${CJK}])`, 'g'), '$1$2')
    .replace(/ {2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
}

function toFullWidthPunct(text: string): string {
  return text
    .replace(/,/g, '，')
    .replace(/\.(?=\s|$)/g, '。')
    .replace(/;(?=\s|$)/g, '；')
    .replace(/:(?=\s|$)/g, '：')
    .replace(/\?/g, '？')
    .replace(/!/g, '！')
    .replace(/\("/g, '（"')
}

function apply(text: string, op: string): string {
  if (op === 'remove') return text.replace(/[ \t]{2,}/g, ' ').replace(/ +([,.;:!?，。；：！？])/g, '$1')
  if (op === 'punct') return toFullWidthPunct(text)
  return addSpacing(text)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '在React里写2026年的第1个组件，用TypeScript类型更稳。',
  note: '规则参考 pangu.js：汉字与西文之间补一个空格，标点前后不补',
  inputLabel: '原文',
  outputLabel: '结果',
}

export default logic
