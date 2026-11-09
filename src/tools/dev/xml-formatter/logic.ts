import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'format', label: '格式化', group: '转换' },
  { id: 'minify', label: '压缩', group: '转换' },
  { id: 'toJson', label: '转 JSON', group: '转换' },
]

function parse(text: string): Document {
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const err = doc.querySelector('parsererror')
  if (err) throw new Error(err.textContent?.split('\n')[0] ?? 'XML 解析失败')
  return doc
}

function indentNode(node: Node, depth: number, pad: string): string {
  const space = pad.repeat(depth)
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue?.trim()
    return text ? `${space}${text}` : ''
  }
  if (node.nodeType === Node.COMMENT_NODE) return `${space}<!--${node.nodeValue}-->`
  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const el = node as Element
  const attrs = [...el.attributes].map((a) => ` ${a.name}="${a.value}"`).join('')
  const children = [...el.childNodes].filter(
    (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.nodeValue?.trim()),
  )

  if (!children.length) return `${space}<${el.tagName}${attrs} />`

  const onlyText = children.every((n) => n.nodeType === Node.TEXT_NODE)
  if (onlyText) {
    return `${space}<${el.tagName}${attrs}>${el.textContent?.trim()}</${el.tagName}>`
  }

  const inner = children.map((c) => indentNode(c, depth + 1, pad)).filter(Boolean).join('\n')
  return `${space}<${el.tagName}${attrs}>\n${inner}\n${space}</${el.tagName}>`
}

function nodeToValue(el: Element): unknown {
  const attrs = [...el.attributes]
  const children = [...el.children]

  if (!children.length) {
    const text = el.textContent?.trim() ?? ''
    if (!attrs.length) return text
    const obj: Record<string, unknown> = {}
    for (const a of attrs) obj[`@${a.name}`] = a.value
    if (text) obj['#text'] = text
    return obj
  }

  const obj: Record<string, unknown> = {}
  for (const a of attrs) obj[`@${a.name}`] = a.value
  const grouped = new Map<string, unknown[]>()
  for (const child of children) {
    const key = child.tagName
    const arr = grouped.get(key) ?? []
    arr.push(nodeToValue(child))
    grouped.set(key, arr)
  }
  for (const [key, arr] of grouped) {
    obj[key] = arr.length === 1 ? arr[0] : arr
  }
  return obj
}

function apply(text: string, op: string): string {
  if (op === 'minify') {
    return text.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()
  }
  const doc = parse(text)
  if (op === 'toJson') {
    const root = doc.documentElement
    return JSON.stringify({ [root.tagName]: nodeToValue(root) }, null, 2)
  }
  return indentNode(doc.documentElement, 0, '  ')
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '<root><item id="1">文本</item><item id="2"><name>嵌套</name></item></root>',
  note: '转 JSON 时属性加 @ 前缀，纯文本节点用 #text',
  inputLabel: 'XML',
  outputLabel: '结果',
  noChain: true,
}

export default logic
