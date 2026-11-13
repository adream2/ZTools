import type { TextOpLogic } from '@/components/templates/types'

export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n')
}

export function minifyCss(css: string): string {
  return stripComments(css)
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s*!\s*important/gi, '!important')
    .trim()
}

const SAMPLE = `.card {
  /* 卡片容器 */
  padding: 16px 20px;
  border-radius: 18px;
  background: #ffffff;
}

.card:hover {
  transform: translateY(-2px);
}`

const logic: TextOpLogic = {
  OPS: [
    { id: 'minify', label: '压缩', group: '处理' },
    { id: 'strip', label: '只删注释', group: '处理' },
  ],
  apply: (text, op) => (op === 'strip' ? stripComments(text) : minifyCss(text)),
  sample: SAMPLE,
  inputLabel: 'CSS',
  outputLabel: '结果',
  autoRun: false,
}

export default logic
