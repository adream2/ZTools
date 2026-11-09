const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c] ?? c)
}

const TOKEN_SOURCE =
  '("(?:\\\\u[\\da-fA-F]{4}|\\\\[^u]|[^\\\\"])*"(\\s*:)?|\\b(?:true|false|null)\\b|-?\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)'

/**
 * 极简 JSON 高亮：逐个 token 转义后套 span，未匹配的文本也转义，
 * 因此不存在把原始 HTML 注入 DOM 的路径。
 */
export function highlightJson(json: string): string {
  const re = new RegExp(TOKEN_SOURCE, 'g')
  let out = ''
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(json)) !== null) {
    out += escapeHtml(json.slice(last, match.index))
    const raw = match[0]
    const trimmed = raw.trimEnd()
    let cls = 'num'
    if (trimmed.startsWith('"')) cls = trimmed.endsWith(':') ? 'key' : 'str'
    else if (trimmed === 'true' || trimmed === 'false') cls = 'bool'
    else if (trimmed === 'null') cls = 'null'
    out += `<span class="j-${cls}">${escapeHtml(raw)}</span>`
    last = match.index + raw.length
  }

  out += escapeHtml(json.slice(last))
  return out
}
