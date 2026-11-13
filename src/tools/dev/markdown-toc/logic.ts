import type { TextOpLogic } from '@/components/templates/types'

interface Heading {
  level: number
  text: string
}

export function parseHeadings(markdown: string): Heading[] {
  const out: Heading[] = []
  let inFence = false
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (m) out.push({ level: m[1]!.length, text: m[2]!.trim() })
  }
  return out
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function toMarkdown(headings: Heading[]): string {
  const min = Math.min(...headings.map((h) => h.level))
  return headings
    .map((h) => `${'  '.repeat(h.level - min)}- [${h.text}](#${slugify(h.text)})`)
    .join('\n')
}

function toHtml(headings: Heading[]): string {
  const min = Math.min(...headings.map((h) => h.level))
  const items = headings
    .map((h) => `  <li class="toc-l${h.level - min + 1}"><a href="#${slugify(h.text)}">${escapeHtml(h.text)}</a></li>`)
    .join('\n')
  return `<ul class="toc">\n${items}\n</ul>`
}

const SAMPLE = `# 使用指南

## 快速开始

### 安装

## 常见问题

\`\`\`bash
# 这行在代码块里，不会进目录
npm install
\`\`\`

## 结语`

const logic: TextOpLogic = {
  OPS: [
    { id: 'md', label: 'Markdown 目录', group: '输出' },
    { id: 'html', label: 'HTML 目录', group: '输出' },
  ],
  apply: (text, op) => {
    const headings = parseHeadings(text)
    if (!headings.length) return '没有找到标题（# 开头的行）'
    return op === 'html' ? toHtml(headings) : toMarkdown(headings)
  },
  sample: SAMPLE,
  inputLabel: 'Markdown 原文',
  outputLabel: '目录',
  autoRun: true,
}

export default logic
