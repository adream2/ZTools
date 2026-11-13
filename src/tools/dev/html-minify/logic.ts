import type { TextOpLogic } from '@/components/templates/types'

const PLACEHOLDER = '\u0000'

export function minifyHtml(html: string): string {
  const blocks: string[] = []
  let out = html.replace(/<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    blocks.push(match)
    return `${PLACEHOLDER}${blocks.length - 1}${PLACEHOLDER}`
  })

  out = out
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n\s*/g, '')
    .trim()

  return out.replace(/\u0000(\d+)\u0000/g, (_, index: string) => blocks[Number(index)] ?? '')
}

const SAMPLE = `<!doctype html>
<html>
  <head>
    <!-- 页面标题 -->
    <title> 示例 </title>
  </head>
  <body>
    <pre>
  这段缩进要保留
    </pre>
  </body>
</html>`

const logic: TextOpLogic = {
  OPS: [
    { id: 'minify', label: '压缩', group: '处理' },
    { id: 'strip', label: '只删注释', group: '处理' },
  ],
  apply: (text, op) =>
    op === 'strip' ? text.replace(/<!--(?!\[if)[\s\S]*?-->/g, '') : minifyHtml(text),
  sample: SAMPLE,
  inputLabel: 'HTML',
  outputLabel: '结果',
  autoRun: false,
}

export default logic
