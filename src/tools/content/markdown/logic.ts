import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ gfm: true, breaks: true })

let hooked = false

function installHook(): void {
  if (hooked) return
  hooked = true
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') ?? ''
      if (/^https?:/i.test(href)) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer nofollow')
      }
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy')
      node.setAttribute('decoding', 'async')
    }
  })
}

export function renderMarkdown(md: string): string {
  installHook()
  const raw = marked.parse(md, { async: false }) as string
  return DOMPurify.sanitize(raw, {
    ADD_ATTR: ['target', 'rel', 'loading', 'decoding'],
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['style', 'onerror', 'onload'],
  })
}

export interface TextStats {
  chars: number
  charsNoSpace: number
  words: number
  cjk: number
  lines: number
  paragraphs: number
  readMinutes: number
}

export function countText(md: string): TextStats {
  const plain = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const cjk = (plain.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const words = (plain.match(/[a-zA-Z0-9]+(?:['-][a-zA-Z0-9]+)*/g) ?? []).length
  const chars = plain.replace(/\s/g, '').length
  // 中文约 300 字/分钟，英文约 200 词/分钟
  const readMinutes = Math.max(1, Math.round(cjk / 300 + words / 200))

  return {
    chars,
    charsNoSpace: chars,
    words,
    cjk,
    lines: md.split(/\r?\n/).length,
    paragraphs: md.split(/\n\s*\n/).filter((p) => p.trim()).length,
    readMinutes,
  }
}

export function exportHtml(md: string, title = 'Markdown 导出'): string {
  const body = renderMarkdown(md)
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { max-width: 760px; margin: 48px auto; padding: 0 20px; line-height: 1.75;
    font-family: system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: #17181c; background: #fff; }
  h1,h2,h3,h4 { line-height: 1.3; margin: 1.6em 0 .6em; }
  h1 { font-size: 1.9em; } h2 { font-size: 1.45em; } h3 { font-size: 1.2em; }
  p, ul, ol, blockquote, pre, table { margin: 0 0 1em; }
  a { color: #2f6bff; }
  code { font-family: ui-monospace, Consolas, monospace; font-size: .9em;
    background: #f4f5f7; padding: 2px 5px; border-radius: 4px; }
  pre { background: #f7f7f8; padding: 14px 16px; border-radius: 8px; overflow: auto; }
  pre code { background: none; padding: 0; }
  blockquote { margin-left: 0; padding-left: 14px; border-left: 3px solid #e6e7eb; color: #5c606b; }
  img { max-width: 100%; height: auto; border-radius: 6px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e6e7eb; padding: 7px 10px; text-align: left; }
  th { background: #f7f7f8; }
  @media (prefers-color-scheme: dark) {
    body { color: #edeef2; background: #101115; }
    code, pre { background: #17181d; }
    blockquote { border-color: #26282f; color: #a2a6b2; }
    th, td { border-color: #26282f; }
    th { background: #17181d; }
    a { color: #6d92ff; }
  }
</style>
</head>
<body>
${body}
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)
}

export const SAMPLE = `# 标题

一段普通文字，支持 **加粗**、*斜体*、\`行内代码\` 和 [链接](https://example.com)。

## 列表

- 第一项
- 第二项
  - 嵌套项

## 代码

\`\`\`js
const answer = 42
console.log(answer)
\`\`\`

> 引用块用来强调观点。

| 名称 | 说明 |
| --- | --- |
| Markdown | 轻量标记语言 |
| HTML | 最终渲染结果 |
`
