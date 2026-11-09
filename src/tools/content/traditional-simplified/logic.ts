import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 't2s', label: '繁体 → 简体', group: '转换' },
  { id: 's2t', label: '简体 → 繁体', group: '转换' },
  { id: 's2tw', label: '简体 → 台湾繁体', group: '转换' },
  { id: 'tw2s', label: '台湾繁体 → 简体', group: '转换' },
]

interface Converter {
  (text: string): string
}

let cache: Record<string, Converter> = {}

async function loadOpenCC(): Promise<void> {
  if (Object.keys(cache).length) return
  const OpenCC = (await import('opencc-js')) as unknown as {
    Converter: (opts: { from: string; to: string }) => Converter
  }
  cache = {
    t2s: OpenCC.Converter({ from: 't', to: 'cn' }),
    s2t: OpenCC.Converter({ from: 'cn', to: 't' }),
    s2tw: OpenCC.Converter({ from: 'cn', to: 'twp' }),
    tw2s: OpenCC.Converter({ from: 'tw', to: 'cn' }),
  }
}

// TextOpTool 的 apply 是同步的，这里预热一次；未就绪时给出可重试提示
void loadOpenCC()

function apply(text: string, op: string): string {
  const conv = cache[op]
  if (!conv) throw new Error('转换词典正在加载，请稍后再点一次')
  return conv(text)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: '这个软件的设计很漂亮，支持繁體與简体互轉。',
  note: '基于 OpenCC 词典，台湾变体含用词替换（如「软件 → 軟體」）',
  inputLabel: '原文',
  outputLabel: '结果',
}

export default logic
