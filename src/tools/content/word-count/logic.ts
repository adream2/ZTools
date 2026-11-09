export interface CountResult {
  chars: number
  charsNoSpace: number
  cjk: number
  words: number
  lines: number
  paragraphs: number
  sentences: number
  readMinutes: number
  speakMinutes: number
}

export interface Keyword {
  word: string
  count: number
  ratio: number
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','if','then','else','of','to','in','on','at','for','with','from','by','as','is','are','was','were','be','been','it','its','this','that','these','those','we','you','they','he','she','i','not','no','do','does','did','can','will','would','should','could','have','has','had','so','than','too','very','just','about','into','over','after','before','also','more','most','some','any','all','one','two','new','use','used','using','which','when','where','how','what','who','why','there','their','our','your','my','me','him','her','them','us','有','的','了','和','是','在','我','你','他','她','它','我们','这','那','就','也','都','而','与','及','对','为','以','被','把','给','让','从','到','上','下','中','个','些','很','还','但','如果','因为','所以','可以','没有','一个','什么','怎么','这个','那个','自己','已经','现在','时候','不是','就是','还是','或者','以及','不过','然后','其实','一下','一些','这些','那些','这样','那样','如何','为什么',
])

export function count(text: string): CountResult {
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const latin = (text.match(/[a-zA-Z0-9]+(?:['’-][a-zA-Z0-9]+)*/g) ?? []).length
  const chars = [...text].length
  const charsNoSpace = [...text.replace(/\s/g, '')].length
  const lines = text ? text.split(/\r?\n/).length : 0
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length
  const sentences = (text.match(/[。！？!?.…]+/g) ?? []).length || (text.trim() ? 1 : 0)

  // 中文 300 字/分钟，英文 200 词/分钟
  const readMinutes = Math.max(cjk > 0 || latin > 0 ? 1 : 0, Math.round(cjk / 300 + latin / 200))
  // 朗读约 240 字/分钟
  const speakMinutes = Math.max(cjk > 0 || latin > 0 ? 1 : 0, Math.round((cjk + latin * 1.8) / 240))

  return { chars, charsNoSpace, cjk, words: latin, lines, paragraphs, sentences, readMinutes, speakMinutes }
}

export function keywords(text: string, limit = 12): Keyword[] {
  const lower = text.toLowerCase()
  const counts = new Map<string, number>()

  // 英文单词
  for (const m of lower.matchAll(/[a-z][a-z'-]{2,}/g)) {
    const w = m[0]
    if (STOP_WORDS.has(w)) continue
    counts.set(w, (counts.get(w) ?? 0) + 1)
  }

  // 中文 2-4 字组合（简单滑窗，过滤停用词）
  const cjkText = text.replace(/[^\u4e00-\u9fa5]/g, ' ')
  for (const seg of cjkText.split(/\s+/)) {
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i + len <= seg.length; i++) {
        const w = seg.slice(i, i + len)
        if (STOP_WORDS.has(w)) continue
        counts.set(w, (counts.get(w) ?? 0) + 1)
      }
    }
  }

  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].length - b[0].length)
    .slice(0, limit)
    .map(([word, n]) => ({ word, count: n, ratio: Math.round((n / total) * 1000) / 10 }))
}

export function charFrequency(text: string, limit = 10): { char: string; count: number }[] {
  const map = new Map<string, number>()
  for (const ch of text.replace(/\s/g, '')) {
    map.set(ch, (map.get(ch) ?? 0) + 1)
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([char, count]) => ({ char, count }))
}
