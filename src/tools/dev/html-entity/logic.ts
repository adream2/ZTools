import type { TextOpLogic } from '@/components/templates/types'

const NAMED: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
  '—': '&mdash;',
  '…': '&hellip;',
}

export const OPS = [
  { id: 'encode', label: '实体编码', group: '转换' },
  { id: 'decode', label: '实体解码', group: '转换' },
  { id: 'encodeAll', label: '全部转数字实体', group: '转换' },
  { id: 'strip', label: '去掉标签', group: '清理' },
  { id: 'stripKeepBr', label: '去标签保留换行', group: '清理' },
]

/**
 * 用 DOMParser 解码实体：它只解析不执行，也不会像 innerHTML 那样
 * 把内容挂到活动文档里，避免出现意料之外的副作用。
 */
function decode(text: string): string {
  if (typeof document === 'undefined') return text
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${text}`, 'text/html')
  return doc.body?.textContent ?? text
}

function strip(text: string, keepBreak: boolean): string {
  let out = text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
  if (keepBreak) {
    out = out.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
  }
  return out.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
}

export function apply(text: string, op: string): string {
  switch (op) {
    case 'encode':
      return text.replace(/[&<>"']/g, (c) => NAMED[c] ?? c)
    case 'decode':
      return decode(text)
    case 'encodeAll':
      return [...text]
        .map((ch) => (ch.charCodeAt(0) > 127 ? `&#${ch.charCodeAt(0)};` : ch))
        .join('')
    case 'strip':
      return strip(text, false)
    case 'stripKeepBr':
      return strip(text, true)
    default:
      return text
  }
}

export const sample = '<p class="tip">Hello&nbsp;<b>世界</b> &copy; 2026</p>'
export const note = '全部注释在本地处理，不会加载任何外部资源'

const logic: TextOpLogic = { OPS, apply, sample, note, inputLabel: 'HTML 或实体', outputLabel: '结果' }
export default logic
